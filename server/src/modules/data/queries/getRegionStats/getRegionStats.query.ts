import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { effectifAnnee } from "../utils/effectifAnnee";
import {
  notHistorique,
  notHistoriqueIndicateurRegionSortie,
} from "../utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../utils/tauxPression";
import { selectTauxRemplissageAgg } from "../utils/tauxRemplissage";

export const getRegionStats = async ({
  codeRegion,
  codeDiplome,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
}: {
  codeRegion: string;
  codeDiplome?: string[];
  rentreeScolaire?: string;
  millesimeSortie?: string;
}) => {
  const statsSortie = await kdb
    .selectFrom("indicateurRegionSortie")
    .innerJoin(
      "formation",
      "formation.codeFormationDiplome",
      "indicateurRegionSortie.cfd"
    )
    .where("indicateurRegionSortie.codeRegion", "=", codeRegion)
    .$call((q) => {
      if (!codeDiplome?.length) return q;
      return q.where("formation.codeNiveauDiplome", "in", codeDiplome);
    })
    .where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    .where(notHistoriqueIndicateurRegionSortie)
    .select([
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as(
        "tauxInsertion6mois"
      ),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as(
        "tauxPoursuiteEtudes"
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
    .where("etablissement.codeRegion", "=", codeRegion)
    .innerJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .$call((q) => {
      if (!codeDiplome?.length) return q;
      return q.where("formation.codeNiveauDiplome", "in", codeDiplome);
    })
    .where(notHistorique)
    .select([
      // sql<string>`MAX("region"."libelleRegion")`.as("libelleRegion"),
      "region.libelleRegion",
      sql<number>`COUNT(distinct CONCAT("formationEtablissement"."cfd", "formationEtablissement"."dispositifId"))`.as(
        "nbFormations"
      ),
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})
      `.as("effectif"),

      selectTauxPressionAgg("indicateurEntree").as("tauxPression"),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
    ])
    .groupBy("region.libelleRegion")
    .executeTakeFirstOrThrow();

  return { ...stats, ...statsSortie };
};
