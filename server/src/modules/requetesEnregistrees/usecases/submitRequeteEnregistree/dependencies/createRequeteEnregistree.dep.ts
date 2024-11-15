import { Insertable } from "kysely";

import { DB, kdb } from "../../../../../db/db";

export const createRequeteEnregistree = async (
  requeteEnregistree: Insertable<DB["requeteEnregistree"]>
) => {
  return await kdb
    .insertInto("requeteEnregistree")
    .values({
      ...requeteEnregistree,
      createdAt: new Date(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};
