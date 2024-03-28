import Boom from "@hapi/boom";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { kdb } from "../../../../db/db";

export const getCurrentCampagne = async () => {
  return kdb
    .selectFrom("campagne")
    .selectAll()
    .where("annee", "=", CURRENT_ANNEE_CAMPAGNE)
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.notFound(
        `Campagne introuvable pour l'année ${CURRENT_ANNEE_CAMPAGNE}`
      );
    });
};
