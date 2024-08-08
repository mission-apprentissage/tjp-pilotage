import Boom from "@hapi/boom";

import { kdb } from "../../../../../db/db";

export const getCampagne = async (anneeCampagne: string) => {
  const campagne = await kdb
    .selectFrom("campagne")
    .selectAll()
    .where("annee", "=", anneeCampagne)
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.notFound(`Aucune campagne pour l'année ${anneeCampagne}`);
    });

  return campagne;
};
