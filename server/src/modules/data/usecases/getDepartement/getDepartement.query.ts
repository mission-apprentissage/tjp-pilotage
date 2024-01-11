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

export const getDepartementStats = async ({
  codeDepartement,
  codeNiveauDiplome,
  rentreeScolaire = "2022",
  millesimeSortie = "2020_2021",
}: {
  codeDepartement: string;
  codeNiveauDiplome?: string[];
  rentreeScolaire?: string;
  millesimeSortie?: string;
}) => {
  const informationsDepartement = await kdb
    .selectFrom("departement")
    .where("codeDepartement", "=", codeDepartement)
    .select(["codeRegion", "libelleDepartement"])
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.badRequest(`Code département invalide : ${codeDepartement}`);
    });

  const statsSortie = await kdb
    .selectFrom("indicateurRegionSortie")
    .leftJoin(
      "formationView",
      "formationView.cfd",
      "indicateurRegionSortie.cfd"
    )
    .leftJoin(
      "departement",
      "departement.codeRegion",
      "indicateurRegionSortie.codeRegion"
    )
    .where(notSecondeCommuneIndicateurRegionSortie)
    .where(notHistoriqueIndicateurRegionSortie)
    .where("departement.codeDepartement", "=", codeDepartement)
    .$call((q) => {
      if (!codeNiveauDiplome?.length) return q;
      return q.where(
        "formationView.codeNiveauDiplome",
        "in",
        codeNiveauDiplome
      );
    })
    .where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    .where((eb) =>
      eb(
        "indicateurRegionSortie.cfd",
        "not in",
        eb.selectFrom("formationHistorique").distinct().select("ancienCFD")
      )
    )
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
    .where("etablissement.codeDepartement", "=", codeDepartement)
    .innerJoin(
      "departement",
      "departement.codeDepartement",
      "etablissement.codeDepartement"
    )
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
    .where("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    .select([
      "departement.codeRegion",
      "departement.libelleDepartement",
      sql<number>`COUNT(distinct CONCAT("formationEtablissement"."cfd", "formationEtablissement"."dispositifId"))`.as(
        "nbFormations"
      ),
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})
      `.as("effectif"),

      selectTauxPressionAgg("indicateurEntree").as("tauxPression"),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
    ])
    .groupBy(["departement.libelleDepartement", "departement.codeRegion"])
    .executeTakeFirst();

  return { ...informationsDepartement, ...stats, ...statsSortie };
};
