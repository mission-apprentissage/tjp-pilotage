import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const createUserInDB = ({ user }: { user: Insertable<DB["user"]> }) =>
  kdb
    .insertInto("user")
    .values(user)
    .onConflict((oc) => oc.column("email").doUpdateSet(user))
    .execute();
