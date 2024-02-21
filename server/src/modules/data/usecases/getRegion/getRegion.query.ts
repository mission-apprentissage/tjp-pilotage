import Boom from "@hapi/boom";
import { sql } from "kysely";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";

import { kdb } from "../../../../db/db";
import { effectifAnnee } from "../../utils/effectifAnnee";
import {
  notAnneeCommune,
  notAnneeCommuneIndicateurRegionSortie,
  notSpecialite,
} from "../../utils/notAnneeCommune";
import { notApprentissageIndicateurRegionSortie } from "../../utils/notApprentissage";
import { notHistoriqueIndicateurRegionSortie } from "../../utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "../../utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "../../utils/tauxPoursuite";
import { selectTauxPressionAgg } from "../../utils/tauxPression";
import { selectTauxRemplissageAgg } from "../../utils/tauxRemplissage";

export const getRegionStats = async ({
  codeRegion,
  codeNiveauDiplome,
  rentreeScolaire = CURRENT_RENTREE,
  millesimeSortie = CURRENT_IJ_MILLESIME,
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
      "formationScolaireView as formationView",
      "formationView.cfd",
      "indicateurRegionSortie.cfd"
    )
    .where("indicateurRegionSortie.codeRegion", "=", codeRegion)
    .where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie)
    .where(notApprentissageIndicateurRegionSortie)
    .where(notAnneeCommuneIndicateurRegionSortie)
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

  const baseStatsEntree = kdb
    .selectFrom("formationEtablissement")
    .leftJoin(
      "formationScolaireView as formationView",
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
    });

  const nbFormations = await baseStatsEntree
    .where(notAnneeCommune)
    .select([
      sql<number>`COUNT(distinct CONCAT("formationEtablissement"."cfd", "formationEtablissement"."dispositifId"))`.as(
        "nbFormations"
      ),
    ])
    .executeTakeFirst();

  const statsEntree = await baseStatsEntree
    .where(notSpecialite)
    .select([
      "region.libelleRegion",
      sql<number>`SUM(${effectifAnnee({ alias: "indicateurEntree" })})
      `.as("effectif"),
      selectTauxPressionAgg("indicateurEntree", "formationView").as(
        "tauxPression"
      ),
      selectTauxRemplissageAgg("indicateurEntree").as("tauxRemplissage"),
    ])
    .groupBy(["region.libelleRegion", "formationView.codeNiveauDiplome"])
    .executeTakeFirst();

  return {
    ...informationsRegion,
    ...statsEntree,
    ...nbFormations,
    ...statsSortie,
  };
};
