import Boom from "@hapi/boom";
import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { effectifAnnee } from "../../utils/effectifAnnee";
import {
  notHistorique,
  notHistoriqueIndicateurRegionSortie,
} from "../../utils/notHistorique";
import {
  notSecondeCommuneIndicateurRegionSortie,
  notSpecialite,
} from "../../utils/notSecondeCommune";
import { selectTauxInsertion6moisAgg } from "../../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../../utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../../utils/tauxPression";
import { selectTauxRemplissageAgg } from "../../utils/tauxRemplissage";

export const getRegionStats = async ({
  codeRegion,
  codeNiveauDiplome,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
}: {
  codeRegion: string;
  codeNiveauDiplome?: string[];
  rentreeScolaire?: string;
  millesimeSortie?: string;
}) => {
  const informationsRegion = await kdb
    .selectFrom("region")
    .where("codeRegion", "=", codeRegion)
    .select(["codeRegion", "libelleRegion"])
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.badRequest(`Code région invalide : ${codeRegion}`);
    });

  const statsSortie = await kdb
    .selectFrom("indicateurRegionSortie")
    .innerJoin(
      "formationView",
      "formationView.cfd",
      "indicateurRegionSortie.cfd"
    )
    .where("indicateurRegionSortie.codeRegion", "=", codeRegion)
    .where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    .where(notSecondeCommuneIndicateurRegionSortie)
    .where(notHistoriqueIndicateurRegionSortie)
    .$call((q) => {
      if (!codeNiveauDiplome?.length) return q;
      return q.where(
        "formationView.codeNiveauDiplome",
        "in",
        codeNiveauDiplome
      );
    })
    .select([
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
    ])
    .executeTakeFirst();

  const stats = await kdb
    .selectFrom("formationEtablissement")
    .leftJoin(
      "formationView",
      "formationView.cfd",
      "formationEtablissement.cfd"
    )
    .leftJoin("indicateurEntree", (join) =>
      join.onRef(
        "formationEtablissement.id",
        "=",
        "indicateurEntree.formationEtablissementId"
      )
    )
    .innerJoin(
      "etablissement",
      "formationEtablissement.UAI",
      "etablissement.UAI"
    )
    .where("etablissement.codeRegion", "=", codeRegion)
    .where("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    .innerJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .$call((q) => {
      if (!codeNiveauDiplome?.length) return q;
      return q.where(
        "formationView.codeNiveauDiplome",
        "in",
        codeNiveauDiplome
      );
    })
    .where(notHistorique)
    .where(notSpecialite)
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
    .executeTakeFirst();

  return {
    ...informationsRegion,
    ...stats,
    ...statsSortie,
  };
};
