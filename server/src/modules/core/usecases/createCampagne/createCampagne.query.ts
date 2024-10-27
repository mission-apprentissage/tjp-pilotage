import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const insertCampagne = async ({ data }: { data: Insertable<DB["campagne"]> }) => {
  await getKbdClient()
    .insertInto("campagne")
    .values(data)
    .onConflict((oc) => oc.column("annee").doNothing())
    .execute();
};
