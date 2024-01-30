import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const createDiplomeProfessionnel = async (
  diplomeProfessionnel: Insertable<DB["diplomeProfessionnel"]>
) => {
  await kdb
    .insertInto("diplomeProfessionnel")
    .values(diplomeProfessionnel)
    .onConflict((oc) =>
      oc.columns(["cfd", "voie"]).doUpdateSet(diplomeProfessionnel)
    )
    .execute();
};
