import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { kdb } from "../../../db/db";

export const getCampagneEnCours = async () => {
  return kdb
    .selectFrom("campagne")
    .where("statut", "=", CampagneStatutEnum["en cours"])
    .selectAll()
    .executeTakeFirst();
};
