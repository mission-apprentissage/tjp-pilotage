import * as Boom from "@hapi/boom";

import { getKbdClient } from "@/db/db";

export const getCampagne = async (anneeCampagne: string) => {
  const campagne = await getKbdClient()
    .selectFrom("campagne")
    .selectAll()
    .where("annee", "=", anneeCampagne)
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.notFound(`Aucune campagne pour l'année ${anneeCampagne}`);
    });

  return campagne;
};
