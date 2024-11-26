import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const createIntentionAccessLog = async (intentionAccessLog: Insertable<DB["intentionAccessLog"]>) => {
  return await getKbdClient()
    .insertInto("intentionAccessLog")
    .values({
      ...intentionAccessLog,
      updatedAt: new Date(),
    })
    .onConflict((oc) => oc.columns(["intentionNumero", "userId"]).doUpdateSet(intentionAccessLog))
    .returningAll()
    .executeTakeFirstOrThrow();
};
