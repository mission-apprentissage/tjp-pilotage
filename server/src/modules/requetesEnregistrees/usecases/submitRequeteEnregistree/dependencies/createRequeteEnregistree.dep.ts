import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const createRequeteEnregistree = async (requeteEnregistree: Insertable<DB["requeteEnregistree"]>) => {
  return await getKbdClient()
    .insertInto("requeteEnregistree")
    .values({
      ...requeteEnregistree,
      createdAt: new Date(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};
