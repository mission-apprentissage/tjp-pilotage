import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { CURRENT_RENTREE } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";

import { getKbdClient } from "@/db/db";
import type { DB } from "@/db/schema";
import { effectifTauxTransformationCumule } from "@/modules/data/utils/effectifTauxTransformationCumule";
import { isInPerimetreIJRegion } from "@/modules/data/utils/isInPerimetreIJ";
import { isScolaireIndicateurRegionSortie } from "@/modules/data/utils/isScolaire";
import { notAnneeCommuneIndicateurRegionSortie } from "@/modules/data/utils/notAnneeCommune";
import { genericOnDemandes } from "@/modules/data/utils/onDemande";
import { selectTauxInsertion6moisAgg } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "@/modules/data/utils/tauxPoursuite";
import { cleanNull } from "@/utils/noNull";

/**
 * On prend le taux de chomage du dernier trimestre de l'année
 * définit le taux de chomage annuel. Or, à cette date (13/02/2024)
 * le taux de chomage du T4 n'est pas encore disponible, nous
 * prenons donc celui de 2022, et inscrivons la valeur en "dur".
 */
const dernierTauxDeChomage = (eb: ExpressionBuilder<DB, "indicateurRegion">) => {
  return eb.or([
    eb("indicateurRegion.rentreeScolaire", "=", "2022"),
    eb("indicateurRegion.rentreeScolaire", "is", null),
  ]);
};

export const getStatsRegions = async ({
  codeNiveauDiplome,
  orderBy = { order: "asc", column: "libelleRegion" },
  rentreesScolaire,
}: {
  codeNiveauDiplome?: string;
  orderBy?: { order: "asc" | "desc"; column: string };
  rentreesScolaire: string[];
}) => {
  const rentreeScolaire = CURRENT_RENTREE;

  const stats = await getKbdClient()
    .with("chomage", (qb) => qb.selectFrom("indicateurRegion").where(dernierTauxDeChomage).select(["tauxChomage", "codeRegion"]))
    .with("indicateursIJ", (qb) => qb.selectFrom("indicateurRegionSortie")
      .leftJoin("formationScolaireView as formationView", "formationView.cfd", "indicateurRegionSortie.cfd")
      .leftJoin("indicateurRegion", "indicateurRegion.codeRegion", "indicateurRegionSortie.codeRegion")
      .leftJoin("region", "region.codeRegion", "indicateurRegionSortie.codeRegion")
      .$call((q) => {
        if (!codeNiveauDiplome) return q;
        return q.where("formationView.codeNiveauDiplome", "in", [codeNiveauDiplome]);
      })
      .$call((q) => {
        if (!rentreeScolaire?.length) return q;
        return q.where(
          "indicateurRegionSortie.millesimeSortie",
          "=",
          getMillesimeFromRentreeScolaire({ rentreeScolaire, offset: 0 })
        );
      })
      .where("indicateurRegionSortie.cfdContinuum", "is", null)
      .where(notAnneeCommuneIndicateurRegionSortie)
      .where(isScolaireIndicateurRegionSortie)
      .select([
        "region.codeRegion",
        "region.libelleRegion",
        selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
        selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
      ])
      .groupBy(["region.codeRegion", "region.libelleRegion",]))
    .with("tauxTransformationCumule", (qb) => qb.selectFrom(
      genericOnDemandes({
        rentreeScolaire: rentreesScolaire,
        codeNiveauDiplome: codeNiveauDiplome ? [codeNiveauDiplome] : undefined,
        statut: [DemandeStatutEnum["demande validée"]],
      })
        .select((eb) => [eb.ref("demande.codeRegion").as("codeRegion")])
        .groupBy(["demande.codeRegion"])
        .as("demandes")
    )
      .leftJoin(
        effectifTauxTransformationCumule({codeNiveauDiplome}).as("effectifs"),
        (join) => join.onRef("demandes.codeRegion", "=", "effectifs.codeRegion")
      )
      .select((eb) => [
        eb.ref("demandes.codeRegion").as("codeRegion"),
        eb.fn.coalesce("effectifs.effectif", eb.val(0)).as("effectifs"),
        eb.fn.coalesce("demandes.placesTransformees", eb.val(0)).as("placesTransformees"),
        sql<number>`CASE
            WHEN ${eb.ref("effectifs.effectif")} IS NULL THEN NULL
            ELSE ROUND( CAST(
              (${eb.fn.coalesce("demandes.placesTransformees", eb.val(0))}::float /
              ${eb.fn.coalesce("effectifs.effectif", eb.val(0))}::float) AS numeric),
              5
            )
          END`.as("tauxTransformationCumule")
      ])
      .$castTo<{codeRegion: string; effectifs: number; placesTransformees: number; tauxTransformationCumule: number;}>())
    .with("tauxTransformationCumulePrevisionnel", (qb) => qb.selectFrom(
      genericOnDemandes({
        rentreeScolaire: rentreesScolaire,
        codeNiveauDiplome: codeNiveauDiplome ? [codeNiveauDiplome] : undefined,
      })
        .select((eb) => [eb.ref("demande.codeRegion").as("codeRegion")])
        .groupBy(["demande.codeRegion"])
        .as("demandes")
    )
      .leftJoin(
        effectifTauxTransformationCumule({codeNiveauDiplome}).as("effectifs"),
        (join) => join.onRef("demandes.codeRegion", "=", "effectifs.codeRegion")
      )
      .select((eb) => [
        eb.ref("demandes.codeRegion").as("codeRegion"),
        eb.fn.coalesce("effectifs.effectif", eb.val(0)).as("effectifs"),
        eb.fn.coalesce("demandes.placesTransformees", eb.val(0)).as("placesTransformees"),
        sql<number>`CASE
              WHEN ${eb.ref("effectifs.effectif")} IS NULL THEN NULL
              ELSE ROUND( CAST(
                (${eb.fn.coalesce("demandes.placesTransformees", eb.val(0))}::float /
                ${eb.fn.coalesce("effectifs.effectif", eb.val(0))}::float) AS numeric),
                5
              )
            END`.as("tauxTransformationCumulePrevisionnel")
      ])
      .$castTo<{
        codeRegion: string;
        effectifs: number;
        placesTransformees: number;
        tauxTransformationCumulePrevisionnel: number;
      }>())
    .selectFrom("region")
    .leftJoin("indicateursIJ", "indicateursIJ.codeRegion", "region.codeRegion")
    .leftJoin("tauxTransformationCumule", "tauxTransformationCumule.codeRegion", "region.codeRegion")
    .leftJoin("tauxTransformationCumulePrevisionnel", "tauxTransformationCumulePrevisionnel.codeRegion", "region.codeRegion")
    .leftJoin("chomage", "chomage.codeRegion", "region.codeRegion")
    .where(isInPerimetreIJRegion)
    .select((eb) => [
      eb.ref("region.codeRegion").as("codeRegion"),
      eb.ref("region.libelleRegion").as("libelleRegion"),
      sql<number>`ROUND(CAST((${eb.ref("chomage.tauxChomage")}::float / ${eb.val(100)}::float) AS numeric), 5)`.as("tauxChomage"),
      eb.ref("indicateursIJ.tauxInsertion").as("tauxInsertion"),
      eb.ref("indicateursIJ.tauxPoursuite").as("tauxPoursuite"),
      jsonBuildObject({
        placesTransformees: eb.ref("tauxTransformationCumule.placesTransformees"),
        effectifs: eb.ref("tauxTransformationCumule.effectifs"),
        taux: eb.ref("tauxTransformationCumule.tauxTransformationCumule"),
      }).as("tauxTransformationCumule"),
      jsonBuildObject({
        placesTransformees: eb.ref("tauxTransformationCumulePrevisionnel.placesTransformees"),
        effectifs: eb.ref("tauxTransformationCumulePrevisionnel.effectifs"),
        taux: eb.ref("tauxTransformationCumulePrevisionnel.tauxTransformationCumulePrevisionnel"),
      }).as("tauxTransformationCumulePrevisionnel"),
    ])
    .$call((q) => {
      if (!orderBy) return q;
      if (orderBy.column === "tauxTransformationCumule" || orderBy.column === "tauxTransformationCumulePrevisionnel") {
        return q.orderBy(sql.ref(`${orderBy.column}.${orderBy.column}`), sql`${sql.raw(orderBy.order)} NULLS LAST`);
      }
      return q.orderBy(sql.ref(orderBy.column), sql`${sql.raw(orderBy.order)} NULLS LAST`);
    })
    .modifyEnd(sql.raw('\n-- Taux de transformation régional'))
    .execute();

  return stats.map(cleanNull);
};
