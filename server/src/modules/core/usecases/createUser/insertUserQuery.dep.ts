import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const insertUserQuery = async (user: Insertable<DB["user"]>) => {
  await kdb.insertInto("user").values(user).execute();
};
