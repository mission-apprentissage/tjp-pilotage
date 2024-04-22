import { Insertable } from "kysely";

import { DB } from "../../../../db/db";
import { updateIntentionWithHistory } from "../../repositories/updateIntentionWithHistory.query";

export const createIntentionQuery = async (
  demande: Insertable<DB["intention"]>
) => {
  return updateIntentionWithHistory({ ...demande });
};
