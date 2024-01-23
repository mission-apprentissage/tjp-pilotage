import Boom from "@hapi/boom";
import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { CURRENT_IJ_MILLESIME } from "../../../import/domain/CURRENT_IJ_MILLESIME";
import { CURRENT_RENTREE } from "../../../import/domain/CURRENT_RENTREE";
import { effectifAnnee } from "../../utils/effectifAnnee";
import {
  notAnneeCommune,
  notAnneeCommuneIndicateurRegionSortie,
  notSpecialite,
} from "../../utils/notAnneeCommune";
import { notHistoriqueIndicateurRegionSortie } from "../../utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "../../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../../utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../../utils/tauxPression";
import { selectTauxRemplissageAgg } from "../../utils/tauxRemplissage";

export const getDepartementStats = async ({
  codeDepartement,
  codeNiveauDiplome,
  rentreeScolaire = CURRENT_RENTREE,
  millesimeSortie = CURRENT_IJ_MILLESIME,
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
    .where(notAnneeCommuneIndicateurRegionSortie)
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

  const baseStatsEntree = kdb
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
    .innerJoin(
      "departement",
      "departement.codeDepartement",
      "etablissement.codeDepartement"
    )
    .where("etablissement.codeDepartement", "=", codeDepartement)
    .where("indicateurEntree.rentreeScolaire", "=", rentreeScolaire)
    .$call((q) => {
      if (!codeNiveauDiplome?.length) return q;
      return q.where(
        "formationView.codeNiveauDiplome",
        "in",
        codeNiveauDiplome
      );
    });

  const nbFormations = await baseStatsEntree
    .where(notAnneeCommune)
    .select(
      sql<number>`COUNT(distinct CONCAT("formationEtablissement"."cfd", "formationEtablissement"."dispositifId"))`.as(
        "nbFormations"
      )
    )
    .executeTakeFirst();

  const statsEntree = await baseStatsEntree
    .where(notSpecialite)
    .select([
      "departement.codeRegion",
      "departement.libelleDepartement",
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})
      `.as("effectif"),

      selectTauxPressionAgg("indicateurEntree").as("tauxPression"),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
    ])
    .groupBy(["departement.libelleDepartement", "departement.codeRegion"])
    .executeTakeFirst();

  return {
    ...informationsDepartement,
    ...statsEntree,
    ...nbFormations,
    ...statsSortie,
  };
};
