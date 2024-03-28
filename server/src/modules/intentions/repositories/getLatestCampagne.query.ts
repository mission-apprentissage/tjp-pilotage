import Boom from "@hapi/boom";
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { kdb } from "../../../db/db";

export const getLatestCampagneQuery = async () => {
  return await kdb
    .selectFrom("campagne")
    .selectAll()
    .where("campagne.annee", "=", CURRENT_ANNEE_CAMPAGNE)
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.preconditionFailed("Campagne introuvable");
    });
};
