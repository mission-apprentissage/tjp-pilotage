import type { Insertable } from "kysely";

import { getKbdClient } from "@/db/db";
import type { DB } from "@/db/schema";

export const createDiscipline = async (discipline: Insertable<DB["discipline"]>) => {
  await getKbdClient()
    .insertInto("discipline")
    .values(discipline)
    .onConflict((oc) => oc.columns(["codeDiscipline"]).doUpdateSet(discipline))
    .execute();
};
