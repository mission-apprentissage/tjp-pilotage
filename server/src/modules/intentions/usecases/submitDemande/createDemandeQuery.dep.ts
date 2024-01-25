import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const createDemandeQuery = async (
  demande: Insertable<DB["demande"]>
) => {
  return await kdb
    .insertInto("demande")
    .values(demande)
    .onConflict((oc) => oc.column("id").doUpdateSet(demande))
    .returningAll()
    .executeTakeFirst();
};
