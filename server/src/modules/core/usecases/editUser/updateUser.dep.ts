import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const updateUser = async ({ userId, data }: { userId: string; data: Insertable<DB["user"]> }) => {
  await getKbdClient()
    .updateTable("user")
    .set({ ...data })
    .where("id", "=", userId)
    .execute();
};
