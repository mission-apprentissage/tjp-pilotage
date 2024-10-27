import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const createUserInDB = async ({ user }: { user: Insertable<DB["user"]> }) =>
  getKbdClient()
    .insertInto("user")
    .values(user)
    .onConflict((oc) => oc.column("email").doUpdateSet(user))
    .execute();
