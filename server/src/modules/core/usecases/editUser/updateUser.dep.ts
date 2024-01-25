import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

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
