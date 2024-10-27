import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const upsertRegionQuery = async (indicateurRegion: Insertable<DB["indicateurRegion"]>) => {
  await getKbdClient()
    .insertInto("indicateurRegion")
    .values(indicateurRegion)
    .onConflict((oc) => oc.column("codeRegion").column("rentreeScolaire").doUpdateSet(indicateurRegion))
    .execute();
};
