import { ExpressionBuilder, sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { getPreviousMillesime } from "../../services/inserJeunesApi/formatMillesime";
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
  millesimeSortie = "2020_2021",
  libelleFiliere,
}: {
  codeRegion?: string;
  codeNiveauDiplome?: string[];
  rentreeScolaire?: string;
  millesimeSortie?: string;
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
            getPreviousMillesime(millesimeSortie)
          );
        return q.where(
          "indicateurRegionSortie.millesimeSortie",
          "=",
          millesimeSortie
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

  return {
    nationale: statsNationale,
    filtered: statsFiltered,
  };
};
