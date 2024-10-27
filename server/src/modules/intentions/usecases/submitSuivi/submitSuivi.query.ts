import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const createSuiviQuery = async (suivi: Insertable<DB["suivi"]>) => {
  return await getKbdClient()
    .insertInto("suivi")
    .values({
      ...suivi,
      createdAt: new Date(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};
