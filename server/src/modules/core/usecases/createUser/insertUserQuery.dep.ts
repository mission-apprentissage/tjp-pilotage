import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const insertUserQuery = async (user: Insertable<DB["user"]>) => {
  await getKbdClient().insertInto("user").values(user).execute();
};
