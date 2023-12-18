import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

export const createDiplomeProfessionnel = async (
  diplomeProfessionnel: Insertable<DB["diplomeProfessionnel"]>
) => {
  await kdb
    .insertInto("diplomeProfessionnel")
    .values(diplomeProfessionnel)
    .onConflict((oc) => oc.column("cfd").doUpdateSet(diplomeProfessionnel))
    .execute();
};
