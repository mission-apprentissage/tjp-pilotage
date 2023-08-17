import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

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
