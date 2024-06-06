import { Insertable } from "kysely";

import { DB } from "../../../../db/db";
import { updateDemandeWithHistory } from "../../repositories/updateDemandeWithHistory.query";

export const createDemandeQuery = async (
  demande: Insertable<DB["demande"]>
) => {
  return updateDemandeWithHistory({ ...demande });
};
