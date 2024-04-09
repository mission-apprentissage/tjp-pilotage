import { kdb } from "../../../db/db";

export const getCampagneEnCours = async () => {
  return kdb
    .selectFrom("campagne")
    .where("statut", "=", "en cours")
    .selectAll()
    .executeTakeFirst();
};
