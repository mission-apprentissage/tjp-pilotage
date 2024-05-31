import { Insertable } from "kysely";

import { DB } from "../../../../../db/db";
import { updateIntentionWithHistory } from "../../../repositories/updateIntentionWithHistory.query";

export const createIntentionQuery = async (
  intention: Insertable<DB["intention"]>
) => {
  return updateIntentionWithHistory({ ...intention });
};
