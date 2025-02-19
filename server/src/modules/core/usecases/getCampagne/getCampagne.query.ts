import * as Boom from '@hapi/boom';

import { getKbdClient } from "@/db/db";

export const getCampagneById = async ({
  campagneId
} : {
  campagneId: string
}) =>
  getKbdClient()
    .selectFrom("campagne")
    .where("id", "=", campagneId)
    .selectAll()
    .executeTakeFirstOrThrow()
    .catch(() => {
      throw Boom.notFound(`Aucune campagne nationale pour l'id ${campagneId}`);
    })
    .then((campagne) => ({
      ...campagne,
      dateDebut: campagne.dateDebut?.toISOString(),
      dateFin: campagne.dateFin?.toISOString(),
    })
    );
