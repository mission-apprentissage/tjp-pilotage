import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const upsertRegionQuery = async (
  indicateurRegion: Insertable<DB["indicateurRegion"]>
) => {
  await kdb
    .insertInto("indicateurRegion")
    .values(indicateurRegion)
    .onConflict((oc) =>
      oc
        .column("codeRegion")
        .column("rentreeScolaire")
        .doUpdateSet(indicateurRegion)
    )
    .execute();
};
