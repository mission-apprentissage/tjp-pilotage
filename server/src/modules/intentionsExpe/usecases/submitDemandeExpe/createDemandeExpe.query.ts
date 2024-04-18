import { Insertable } from "kysely";

import { DB } from "../../../../db/db";
import { updateDemandeExpeWithHistory } from "../../repositories/updateDemandeExpeWithHistory.query";

export const createDemandeExpeQuery = async (
  demande: Insertable<DB["demandeExpe"]>
) => {
  return updateDemandeExpeWithHistory({ ...demande });
};
