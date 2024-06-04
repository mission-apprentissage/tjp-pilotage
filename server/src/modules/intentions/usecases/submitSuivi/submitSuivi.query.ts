import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const createSuiviQuery = async (suivi: Insertable<DB["suivi"]>) => {
  return await kdb
    .insertInto("suivi")
    .values({
      ...suivi,
      createdAt: new Date(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};
