import  Boom  from "@hapi/boom";

import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const getLatestCampagneQuery = async () => {
  return await getKbdClient()
    .selectFrom("campagne")
    .selectAll()
    .orderBy("campagne.annee", "desc")
    .executeTakeFirstOrThrow()
    .catch((_e) => {
      throw Boom.notFound("Aucune campagne trouvée");
    })
    .then((campagne) => cleanNull({
      ...campagne,
      dateDebut: campagne.dateDebut.toISOString(),
      dateFin: campagne.dateFin.toISOString()
    }));
};
