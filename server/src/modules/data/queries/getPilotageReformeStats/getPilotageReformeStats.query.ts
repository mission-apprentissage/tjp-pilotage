import { ExpressionBuilder, sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { cleanNull } from "../../../../utils/noNull";
import {
  getMillesimeFromRentreeScolaire,
  getPreviousMillesime,
} from "../../services/inserJeunesApi/formatMillesime";
import { effectifAnnee } from "../utils/effectifAnnee";
import {
  notHistorique,
  notHistoriqueIndicateurRegionSortie,
} from "../utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../utils/tauxPoursuite";

export const getPilotageReformeStats = async ({
  codeRegion,
  codeNiveauDiplome,
  rentreeScolaire = "2022",
  libelleFiliere,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string[];
  rentreeScolaire?: string;
  libelleFiliere?: string[];
}) => {
  const selectStatsSortie = ({
    eb,
    isFiltered = false,
    isPreviousMillesime = false,
  }: {
    eb: ExpressionBuilder<DB, "indicateurRegionSortie">;
    isFiltered: boolean;
    isPreviousMillesime: boolean;
  }) =>
    eb
      .selectFrom("indicateurRegionSortie")
      .leftJoin(
        "formation",
        "formation.codeFormationDiplome",
        "indicateurRegionSortie.cfd"
      )
      .leftJoin(
        "etablissement",
        "etablissement.codeRegion",
        "indicateurRegionSortie.codeRegion"
      )
      .$call((q) => {
        if (!isFiltered || !codeRegion?.length) return q;
        return q.where("indicateurRegionSortie.codeRegion", "=", codeRegion);
      })
      .$call((q) => {
        if (!codeNiveauDiplome?.length) return q;
        return q.where("formation.codeNiveauDiplome", "in", codeNiveauDiplome);
      })
      .$call((q) => {
        if (!libelleFiliere?.length) return q;
        return q.where("formation.libelleFiliere", "in", libelleFiliere);
      })
      .$call((q) => {
        if (isPreviousMillesime)
          return q.where(
            "indicateurRegionSortie.millesimeSortie",
            "=",
            getPreviousMillesime(
              getMillesimeFromRentreeScolaire(rentreeScolaire)
            )
          );
        return q.where(
          "indicateurRegionSortie.millesimeSortie",
          "=",
          getMillesimeFromRentreeScolaire(rentreeScolaire)
        );
      })
      .where(notHistoriqueIndicateurRegionSortie)
      .select([
        selectTauxInsertion6moisAgg("indicateurRegionSortie").as(
          "tauxInsertion6mois"
        ),
        selectTauxPoursuiteAgg("indicateurRegionSortie").as(
          "tauxPoursuiteEtudes"
        ),
      ]);
  const statsFiltered = await kdb
    .selectFrom("formationEtablissement")
    .leftJoin(
      "formation",
      "formation.codeFormationDiplome",
      "formationEtablissement.cfd"
    )
    .innerJoin("indicateurEntree", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurEntree.formationEtablissementId"
        )
        .on("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    )
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .$call((q) => {
      if (!codeRegion) return q;
      return q.where("etablissement.codeRegion", "=", codeRegion);
    })
    .$call((q) => {
      if (!codeNiveauDiplome?.length) return q;
      return q.where("formation.codeNiveauDiplome", "in", codeNiveauDiplome);
    })
    .$call((q) => {
      if (!libelleFiliere?.length) return q;
      return q.where("formation.libelleFiliere", "in", libelleFiliere);
    })
    .where("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    .where(notHistorique)
    .select([
      sql<number>`COUNT(distinct CONCAT("formationEtablissement"."cfd", "formationEtablissement"."dispositifId"))`.as(
        "nbFormations"
      ),
      sql<number>`COUNT(distinct "formationEtablissement"."UAI")`.as(
        "nbEtablissements"
      ),
      sql<number>`COALESCE(SUM(${effectifAnnee({
        alias: "indicateurEntree",
      })}),0)`.as("effectif"),
    ])
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom("indicateurRegionSortie")
          .select((eb) => [
            jsonObjectFrom(
              selectStatsSortie({
                eb,
                isFiltered: true,
                isPreviousMillesime: true,
              })
            ).as("anneePrecedente"),
            jsonObjectFrom(
              selectStatsSortie({
                eb,
                isFiltered: true,
                isPreviousMillesime: false,
              })
            ).as("anneeEnCours"),
          ])
          .limit(1)
      ).as("statsSortie"),
    ])
    .executeTakeFirstOrThrow();

  const statsNationale = await kdb
    .selectFrom("formationEtablissement")
    .leftJoin(
      "formation",
      "formation.codeFormationDiplome",
      "formationEtablissement.cfd"
    )
    .innerJoin("indicateurEntree", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurEntree.formationEtablissementId"
        )
        .on("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    )
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .$call((q) => {
      if (!codeNiveauDiplome?.length) return q;
      return q.where("formation.codeNiveauDiplome", "in", codeNiveauDiplome);
    })
    .$call((q) => {
      if (!libelleFiliere?.length) return q;
      return q.where("formation.libelleFiliere", "in", libelleFiliere);
    })
    .where("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    .where(notHistorique)
    .select([
      sql<number>`COUNT(distinct CONCAT("formationEtablissement"."cfd", "formationEtablissement"."dispositifId"))`.as(
        "nbFormations"
      ),
      sql<number>`COUNT(distinct "formationEtablissement"."UAI")`.as(
        "nbEtablissements"
      ),
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})`.as(
        "effectif"
      ),
    ])
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom("indicateurRegionSortie")
          .select((eb) => [
            jsonObjectFrom(
              selectStatsSortie({
                eb,
                isFiltered: false,
                isPreviousMillesime: true,
              })
            ).as("anneePrecedente"),
            jsonObjectFrom(
              selectStatsSortie({
                eb,
                isFiltered: false,
                isPreviousMillesime: false,
              })
            ).as("anneeEnCours"),
          ])
          .limit(1)
      ).as("statsSortie"),
    ])
    .executeTakeFirstOrThrow();

  const filtersBase = kdb
    .selectFrom("formation")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formation.codeFormationDiplome"
    )
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formation.codeNiveauDiplome"
    )
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .leftJoin(
      "indicateurEntree",
      "indicateurEntree.formationEtablissementId",
      "formationEtablissement.id"
    )
    .leftJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .where(
      "codeFormationDiplome",
      "not in",
      sql`(SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`
    )
    .distinct()
    .$castTo<{ label: string; value: string }>();

  const regions = await filtersBase
    .select(["region.libelleRegion as label", "region.codeRegion as value"])
    .where("region.codeRegion", "is not", null)
    .execute();

  const diplomes = await filtersBase
    .select([
      "niveauDiplome.libelleNiveauDiplome as label",
      "niveauDiplome.codeNiveauDiplome as value",
    ])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where("niveauDiplome.codeNiveauDiplome", "in", ["500", "320", "400"])
    .execute();

  const rentreesScolaires = await filtersBase
    .select([
      "indicateurEntree.rentreeScolaire as label",
      "indicateurEntree.rentreeScolaire as value",
    ])
    .where("indicateurEntree.rentreeScolaire", "is not", null)
    .execute();

  const libelleFilieres = filtersBase
    .select([
      "formation.libelleFiliere as label",
      "formation.libelleFiliere as value",
    ])
    .where("formation.libelleFiliere", "is not", null)
    .where((eb) =>
      eb.or([
        eb.and([]),
        libelleFiliere
          ? eb.cmpr("formation.libelleFiliere", "in", libelleFiliere)
          : sql`false`,
      ])
    )
    .execute();

  const filters = await {
    regions: (await regions).map(cleanNull),
    libelleFilieres: (await libelleFilieres).map(cleanNull),
    diplomes: (await diplomes).map(cleanNull),
    rentreesScolaires: (await rentreesScolaires).map(cleanNull),
  };

  return {
    filters: filters,
    nationale: statsNationale,
    filtered: statsFiltered,
  };
};
