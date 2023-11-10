import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { effectifAnnee } from "../utils/effectifAnnee";
import { notHistorique, notHistoriqueIndicateurRegionSortie } from "../utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../utils/tauxPression";
import { selectTauxRemplissageAgg } from "../utils/tauxRemplissage";

export const getDepartementsStats = async ({
  codeDepartement,
  codeDiplome,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
}: {
  codeDepartement: string;
  codeDiplome?: string[];
  rentreeScolaire?: string;
  millesimeSortie?: string;
}) => {
  const statsSortie = await kdb
    .selectFrom("indicateurRegionSortie")
    .leftJoin(
      "formation",
      "formation.codeFormationDiplome",
      "indicateurRegionSortie.cfd"
    )
    .leftJoin(
      "departement",
      "departement.codeRegion",
      "indicateurRegionSortie.codeRegion"
    )
    .where(notHistoriqueIndicateurRegionSortie)
    .where("departement.codeDepartement", "=", codeDepartement)
    .$call((q) => {
      if (!codeDiplome?.length) return q;
      return q.where("formation.codeNiveauDiplome", "in", codeDiplome);
    })
    .where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    .where((eb) =>
      eb(
        "indicateurRegionSortie.cfd",
        "not in",
        sql`(SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`
      )
    )
    .select([
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as(
        "tauxInsertion"
      ),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as(
        "tauxPoursuite"
      ),
    ])
    .executeTakeFirstOrThrow();

  const stats = await kdb
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
    .innerJoin(
      "etablissement",
      "formationEtablissement.UAI",
      "etablissement.UAI"
    )
    .where("etablissement.codeDepartement", "=", codeDepartement)
    .innerJoin(
      "departement",
      "departement.codeDepartement",
      "etablissement.codeDepartement"
    )
    .$call((q) => {
      if (!codeDiplome?.length) return q;
      return q.where("formation.codeNiveauDiplome", "in", codeDiplome);
    })
    .where(notHistorique)
    .select([
      "departement.codeRegion",
      "departement.libelle as libelleDepartement",
      sql<number>`COUNT(distinct CONCAT("formationEtablissement"."cfd", "formationEtablissement"."dispositifId"))`.as(
        "nbFormations"
      ),
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})
      `.as("effectif"),

      selectTauxPressionAgg("indicateurEntree").as("tauxPression"),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
    ])
    .groupBy(["departement.libelle", "departement.codeRegion"])
    .executeTakeFirstOrThrow();

  return { ...stats, ...statsSortie };
};
