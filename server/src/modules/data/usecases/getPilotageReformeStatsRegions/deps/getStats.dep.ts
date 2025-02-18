import type { ExpressionBuilder } from "kysely";
import { sql } from "kysely";
import { jsonBuildObject } from "kysely/helpers/postgres";
import { CURRENT_RENTREE } from "shared";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { rentreeScolaireCampagnes } from "shared/time/rentreeScolaireCampagnes";
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
}: {
  codeNiveauDiplome?: string;
  orderBy?: { order: "asc" | "desc"; column: string };
}) => {
  const rentreeScolaire = CURRENT_RENTREE;

  const stats = await getKbdClient()
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
      .where(dernierTauxDeChomage)
      .select([
        "region.codeRegion",
        "region.libelleRegion",
        "indicateurRegion.tauxChomage",
        selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
        selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
      ])
      .groupBy(["region.codeRegion", "region.libelleRegion", "indicateurRegion.tauxChomage"]))
    .with("tauxTransformationCumule", (qb) => qb.selectFrom(
      genericOnDemandes({
        rentreeScolaire: rentreeScolaireCampagnes(),
        codeNiveauDiplome: codeNiveauDiplome ? [codeNiveauDiplome] : undefined,
      })
        .where("demande.statut", "=", DemandeStatutEnum["demande validée"])
        .where("campagne.statut", "=", CampagneStatutEnum["terminée"])
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
        eb.fn.coalesce("effectifs.effectif", eb.val(0)).as("effectif"),
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
      .$castTo<{codeRegion: string; effectif: number; placesTransformees: number; tauxTransformationCumule: number;}>())
    .selectFrom("region")
    .leftJoin("indicateursIJ", "indicateursIJ.codeRegion", "region.codeRegion")
    .leftJoin("tauxTransformationCumule", "tauxTransformationCumule.codeRegion", "region.codeRegion")
    .where(isInPerimetreIJRegion)
    .select((eb) => [
      eb.ref("region.codeRegion").as("codeRegion"),
      eb.ref("region.libelleRegion").as("libelleRegion"),
      sql<number>`ROUND(CAST((${eb.ref("indicateursIJ.tauxChomage")}::float / ${eb.val(100)}::float) AS numeric), 5)`.as("tauxChomage"),
      eb.ref("indicateursIJ.tauxInsertion").as("tauxInsertion"),
      eb.ref("indicateursIJ.tauxPoursuite").as("tauxPoursuite"),
      jsonBuildObject({
        placesTransformees: eb.ref("tauxTransformationCumule.placesTransformees"),
        effectifs: eb.ref("tauxTransformationCumule.effectif"),
        taux: eb.ref("tauxTransformationCumule.tauxTransformationCumule"),
      }).as("tauxTransformationCumule"),
    ])
    .$call((q) => {
      if (!orderBy) return q;
      return q.orderBy(sql.ref(orderBy.column), sql`${sql.raw(orderBy.order)} NULLS LAST`);
    })
    .execute();

  return stats.map(cleanNull);
};
