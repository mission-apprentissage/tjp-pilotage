import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

export const createUserInDB = ({ user }: { user: Insertable<DB["user"]> }) =>
  kdb
    .insertInto("user")
    .values(user)
    .onConflict((oc) => oc.column("email").doUpdateSet(user))
    .execute();
