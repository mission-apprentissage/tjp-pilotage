import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

export const createDemandeQuery = async (
  demande: Insertable<DB["demande"]>
) => {
  return await kdb
    .insertInto("demande")
    .values(demande)
    .onConflict((oc) =>
      oc.column("id").doUpdateSet({ ...demande, createurId: undefined })
    )
    .returningAll()
    .execute();
};
