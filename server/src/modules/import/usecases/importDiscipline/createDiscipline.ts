import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

export const createDiscipline = async (
  discipline: Insertable<DB["discipline"]>
) => {
  await kdb
    .insertInto("discipline")
    .values(discipline)
    .onConflict((oc) => oc.columns(["codeDiscipline"]).doUpdateSet(discipline))
    .execute();
};
