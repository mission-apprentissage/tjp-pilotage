import Boom from "@hapi/boom";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { getKbdClient } from "@/db/db";

const getLatestCampagne = async () =>
  getKbdClient()
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
  return getKbdClient()
    .selectFrom("campagne")
    .selectAll()
    .where("statut", "=", CampagneStatutEnum["en cours"])
    .executeTakeFirstOrThrow()
    .catch(async () => {
      // Si aucune campagne en cours, on renvoie la dernière campagne
      return getLatestCampagne();
    });
};
