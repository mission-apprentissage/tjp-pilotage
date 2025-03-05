import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const insertCampagneRegion = async ({ data }: { data: Insertable<DB["campagneRegion"]> }) => {
  await getKbdClient()
    .insertInto("campagneRegion")
    .values(data)
    .execute();
};
