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
  codesNiveauxDiplomes,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
}: {
  codeRegion: string;
  codesNiveauxDiplomes?: string[];
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
    .where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    .where(notHistoriqueIndicateurRegionSortie)
    .$call((q) => {
      if (!codesNiveauxDiplomes?.length) return q;
      return q.where("formation.codeNiveauDiplome", "in", codesNiveauxDiplomes);
    })
    .select([
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as(
        "tauxInsertion"
      ),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as(
        "tauxPoursuite"
      ),
    ])
    .executeTakeFirst();

  const stats = await kdb
    .selectFrom("formationEtablissement")
    .leftJoin(
      "formation",
      "formation.codeFormationDiplome",
      "formationEtablissement.cfd"
    )
    .leftJoin("indicateurEntree", (join) =>
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
      if (!codesNiveauxDiplomes?.length) return q;
      return q.where("formation.codeNiveauDiplome", "in", codesNiveauxDiplomes);
    })
    .where(notHistorique)
    .select([
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

  return {
    ...stats,
    ...statsSortie
  };
};
