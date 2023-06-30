import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { effectifAnnee } from "../utils/effectifAnnee";
import { notHistorique } from "../utils/notHistorique";
import { selectTauxInsertion12moisAgg } from "../utils/tauxInsertion12mois";
import { selectTauxPoursuiteAgg } from "../utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../utils/tauxPression";
import { selectTauxRemplissageAgg } from "../utils/tauxRemplissage";

export const getRegionStats = async ({
  codeRegion,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
}: {
  codeRegion: string;
  rentreeScolaire?: string;
  millesimeSortie?: string;
}) => {
  const statsSortie = await kdb
    .selectFrom("indicateurRegionSortie")
    .where("indicateurRegionSortie.codeRegion", "=", codeRegion)
    .where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    .select([
      selectTauxInsertion12moisAgg("indicateurRegionSortie").as(
        "tauxInsertion12mois"
      ),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as(
        "tauxPoursuiteEtudes"
      ),
    ])
    .executeTakeFirst();

  const stats = await kdb
    .selectFrom("formationEtablissement")
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
    .where(notHistorique)
    .select([
      sql<number>`COUNT(distinct CONCAT("formationEtablissement"."cfd", "formationEtablissement"."dispositifId"))`.as(
        "nbFormations"
      ),
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})
      `.as("effectif"),

      selectTauxPressionAgg("indicateurEntree").as("tauxPression"),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
    ])
    .executeTakeFirst();

  return { ...stats, ...statsSortie };
};
