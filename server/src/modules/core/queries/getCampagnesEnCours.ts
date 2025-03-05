import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { getKbdClient } from "@/db/db";

export const getCampagnesEnCours = async () => {
  return getKbdClient()
    .selectFrom("campagne")
    .where("statut", "=", CampagneStatutEnum["en cours"])
    .selectAll()
    .orderBy("annee", "desc")
    .execute();
};
