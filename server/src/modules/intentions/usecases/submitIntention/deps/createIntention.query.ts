import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { updateIntentionWithHistory } from "@/modules/intentions/repositories/updateIntentionWithHistory.query";

export const createIntentionQuery = async (intention: Insertable<DB["intention"]>) => {
  return updateIntentionWithHistory({ ...intention });
};
