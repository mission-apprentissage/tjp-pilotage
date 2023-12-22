import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

export const updateUser = async ({
  userId,
  data,
}: {
  userId: string;
  data: Insertable<DB["user"]>;
}) => {
  await kdb
    .updateTable("user")
    .set({ ...data })
    .where("id", "=", userId)
    .execute();
};
