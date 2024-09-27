import { Insertable } from "kysely";

import { DB, kdb } from "../../../../../db/db";

export const createIntentionAccessLog = async (
  intentionAccessLog: Insertable<DB["intentionAccessLog"]>
) => {
  return await kdb
    .insertInto("intentionAccessLog")
    .values({
      ...intentionAccessLog,
      updatedAt: new Date(),
    })
    .onConflict((oc) =>
      oc.columns(["intentionNumero", "userId"]).doUpdateSet(intentionAccessLog)
    )
    .returningAll()
    .executeTakeFirstOrThrow();
};
