import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

export const insertUserQuery = async (user: Insertable<DB["user"]>) => {
  await kdb.insertInto("user").values(user).execute();
};
