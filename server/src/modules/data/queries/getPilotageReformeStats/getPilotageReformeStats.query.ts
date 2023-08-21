import { ExpressionBuilder, sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { cleanNull } from "../../../../utils/noNull";
import {
  getMillesimeFromRentreeScolaire,
  getRentreeScolaire,
} from "../../services/inserJeunesApi/formatMillesime";
import { effectifAnnee } from "../utils/effectifAnnee";
import {
  notHistorique,
  notHistoriqueIndicateurRegionSortie,
} from "../utils/notHistorique";
import { selectTauxDecrochageNatAgg } from "../utils/tauxDecrochage";
import { selectTauxInsertion6moisAgg } from "../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../utils/tauxPoursuite";

export const getPilotageReformeStats = async ({
  codeRegion,
  codeNiveauDiplome,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string[];
}) => {
  const rentreeScolaire = "2022";

  const selectStatsEffectif = ({
    eb,
    isFiltered = false,
    annee = 0,
  }: {
    eb: ExpressionBuilder<DB, "indicateurRegionSortie">;
    isFiltered: boolean;
    annee: number;
  }) => {
    return eb
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
          .on(
            "indicateurEntree.rentreeScolaire",
            "=",
            getRentreeScolaire({ rentreeScolaire, offset: annee })
          )
      )
      .leftJoin(
        "etablissement",
        "etablissement.UAI",
        "formationEtablissement.UAI"
      )
      .$call((q) => {
        if (!isFiltered || !codeRegion) return q;
        return q.where("etablissement.codeRegion", "=", codeRegion);
      })
      .$call((q) => {
        if (!codeNiveauDiplome?.length) return q;
        return q.where("formation.codeNiveauDiplome", "in", codeNiveauDiplome);
      })
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
      ]);
  };

  const selectStatsSortie = ({
    eb,
    isFiltered = false,
    annee = 0,
  }: {
    eb: ExpressionBuilder<DB, "indicateurRegionSortie">;
    isFiltered: boolean;
    annee: number;
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
      .leftJoin(
        "indicateurRegion",
        "indicateurRegion.codeRegion",
        "indicateurRegionSortie.codeRegion"
      )
      .$call((q) => {
        if (!isFiltered || !codeRegion) return q;
        return q.where("indicateurRegionSortie.codeRegion", "=", codeRegion);
      })
      .$call((q) => {
        if (!codeNiveauDiplome?.length) return q;
        return q.where("formation.codeNiveauDiplome", "in", codeNiveauDiplome);
      })
      .$call((q) =>
        q.where(
          "indicateurRegionSortie.millesimeSortie",
          "=",
          getMillesimeFromRentreeScolaire({ rentreeScolaire, offset: annee })
        )
      )
      .where(notHistoriqueIndicateurRegionSortie)
      .select([
        selectTauxInsertion6moisAgg("indicateurRegionSortie").as(
          "tauxInsertion6mois"
        ),
        selectTauxPoursuiteAgg("indicateurRegionSortie").as(
          "tauxPoursuiteEtudes"
        ),
        selectTauxDecrochageNatAgg("indicateurRegion").as("tauxDecrochage"),
      ]);

  const statsAnneeN = await kdb
    .selectFrom("formationEtablissement")
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom("indicateurRegionSortie")
          .select((eb) => [
            jsonObjectFrom(
              selectStatsEffectif({
                eb,
                isFiltered: false,
                annee: 0,
              })
            ).as("statsEffectif"),
            jsonObjectFrom(
              selectStatsSortie({
                eb,
                isFiltered: false,
                annee: 0,
              })
            ).as("statsSortie"),
          ])
          .limit(1)
      ).as("nationale"),
      jsonObjectFrom(
        eb
          .selectFrom("indicateurRegionSortie")
          .select((eb) => [
            jsonObjectFrom(
              selectStatsEffectif({
                eb,
                isFiltered: true,
                annee: 0,
              })
            ).as("statsEffectif"),
            jsonObjectFrom(
              selectStatsSortie({
                eb,
                isFiltered: true,
                annee: 0,
              })
            ).as("statsSortie"),
          ])
          .limit(1)
      ).as("filtered"),
    ])
    .executeTakeFirstOrThrow();

  const statsAnneeNMoins1 = await kdb
    .selectFrom("formationEtablissement")
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom("indicateurRegionSortie")
          .select((eb) => [
            jsonObjectFrom(
              selectStatsEffectif({
                eb,
                isFiltered: false,
                annee: -1,
              })
            ).as("statsEffectif"),
            jsonObjectFrom(
              selectStatsSortie({
                eb,
                isFiltered: false,
                annee: -1,
              })
            ).as("statsSortie"),
          ])
          .limit(1)
      ).as("nationale"),
    ])
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom("indicateurRegionSortie")
          .select((eb) => [
            jsonObjectFrom(
              selectStatsEffectif({
                eb,
                isFiltered: true,
                annee: -1,
              })
            ).as("statsEffectif"),
            jsonObjectFrom(
              selectStatsSortie({
                eb,
                isFiltered: true,
                annee: -1,
              })
            ).as("statsSortie"),
          ])
          .limit(1)
      ).as("filtered"),
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

  const filters = await {
    regions: (await regions).map(cleanNull),
    diplomes: (await diplomes).map(cleanNull),
  };

  return {
    filters: filters,
    anneeN: {
      filtered: {
        ...statsAnneeN.filtered?.statsEffectif,
        ...statsAnneeN.filtered?.statsSortie,
      },
      nationale: {
        ...statsAnneeN.nationale?.statsEffectif,
        ...statsAnneeN.nationale?.statsSortie,
      },
    },
    anneeNMoins1: {
      filtered: {
        ...statsAnneeNMoins1.filtered?.statsEffectif,
        ...statsAnneeNMoins1.filtered?.statsSortie,
      },
      nationale: {
        ...statsAnneeNMoins1.nationale?.statsEffectif,
        ...statsAnneeNMoins1.nationale?.statsSortie,
      },
    },
  };
};
