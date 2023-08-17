import { ExpressionBuilder, sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { cleanNull } from "../../../../utils/noNull";
import {
  getMillesimeFromRentreeScolaire,
  getPreviousMillesime,
  getPreviousRentreeScolaire,
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
  const selectStatsEffectif = ({
    eb,
    isFiltered = false,
    isAnneePrecedente = false,
  }: {
    eb: ExpressionBuilder<DB, "indicateurRegionSortie">;
    isFiltered: boolean;
    isAnneePrecedente: boolean;
  }) =>
    eb
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
            isAnneePrecedente
              ? getPreviousRentreeScolaire(rentreeScolaire)
              : rentreeScolaire
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
      .$call((q) => {
        if (!libelleFiliere?.length) return q;
        return q.where("formation.libelleFiliere", "in", libelleFiliere);
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

  const selectStatsSortie = ({
    eb,
    isFiltered = false,
    isAnneePrecedente = false,
  }: {
    eb: ExpressionBuilder<DB, "indicateurRegionSortie">;
    isFiltered: boolean;
    isAnneePrecedente: boolean;
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
        if (!isFiltered || !codeRegion) return q;
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
      .$call((q) =>
        q.where(
          "indicateurRegionSortie.millesimeSortie",
          "=",
          isAnneePrecedente
            ? getPreviousMillesime(
                getMillesimeFromRentreeScolaire(rentreeScolaire)
              )
            : getMillesimeFromRentreeScolaire(rentreeScolaire)
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
      ]);

  const statsAnneeEnCours = await kdb
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
                isAnneePrecedente: false,
              })
            ).as("statsEffectif"),
            jsonObjectFrom(
              selectStatsSortie({
                eb,
                isFiltered: false,
                isAnneePrecedente: false,
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
                isAnneePrecedente: false,
              })
            ).as("statsEffectif"),
            jsonObjectFrom(
              selectStatsSortie({
                eb,
                isFiltered: true,
                isAnneePrecedente: false,
              })
            ).as("statsSortie"),
          ])
          .limit(1)
      ).as("filtered"),
    ])
    .executeTakeFirstOrThrow();

  const statsAnneePrecedente = await kdb
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
                isAnneePrecedente: true,
              })
            ).as("statsEffectif"),
            jsonObjectFrom(
              selectStatsSortie({
                eb,
                isFiltered: false,
                isAnneePrecedente: true,
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
                isAnneePrecedente: true,
              })
            ).as("statsEffectif"),
            jsonObjectFrom(
              selectStatsSortie({
                eb,
                isFiltered: true,
                isAnneePrecedente: true,
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
    anneeEnCours: {
      filtered: {
        ...statsAnneeEnCours.filtered?.statsEffectif,
        ...statsAnneeEnCours.filtered?.statsSortie,
      },
      nationale: {
        ...statsAnneeEnCours.nationale?.statsEffectif,
        ...statsAnneeEnCours.nationale?.statsSortie,
      },
    },
    anneePrecedente: {
      filtered: {
        ...statsAnneePrecedente.filtered?.statsEffectif,
        ...statsAnneePrecedente.filtered?.statsSortie,
      },
      nationale: {
        ...statsAnneePrecedente.nationale?.statsEffectif,
        ...statsAnneePrecedente.nationale?.statsSortie,
      },
    },
  };
};
