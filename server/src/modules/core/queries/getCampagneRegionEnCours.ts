import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { getKbdClient } from "@/db/db";

export const getCampagneRegionEnCours = async ({codeRegion}:{codeRegion: string}) => {
  return getKbdClient()
    .selectFrom("campagneRegion")
    .where("statut", "=", CampagneStatutEnum["en cours"])
    .where("codeRegion", "=", codeRegion)
    .selectAll()
    .executeTakeFirst();
};
