import * as Boom from "@hapi/boom";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const getLatestCampagneQuery = async () => {
  return await getKbdClient()
    .selectFrom("campagne")
    .selectAll()
    .where("statut", "=", CampagneStatutEnum["en cours"])
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
