import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";

export const createCorrectionQuery = async ({
  correction,
  user,
}: {
  correction: Insertable<DB["correction"]>;
  user: Pick<RequestUser, "id">;
}) => {
  return getKbdClient()
    .insertInto("correction")
    .values({
      ...correction,
      createdBy: user.id,
      updatedBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning("id")
    .executeTakeFirst();
};
