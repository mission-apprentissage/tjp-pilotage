import Boom from "@hapi/boom";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { kdb } from "../../../../db/db";

const getLatestCampagne = async () =>
  kdb
    .selectFrom("campagne")
    .selectAll()
    .orderBy("annee", "desc")
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.notFound("Aucune campagne en cours", {
        errors: {
          campagne_en_cours_introuvable: "Aucune campagne en cours",
        },
      });
    });

export const getCurrentCampagneQuery = async () => {
  return kdb
    .selectFrom("campagne")
    .selectAll()
    .where("statut", "=", CampagneStatutEnum["en cours"])
    .executeTakeFirstOrThrow()
    .catch(() => {
      // Si aucune campagne en cours, on renvoie la dernière campagne
      return getLatestCampagne();
    });
};
