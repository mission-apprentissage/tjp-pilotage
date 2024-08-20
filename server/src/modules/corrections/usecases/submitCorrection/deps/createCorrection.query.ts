import { Insertable } from "kysely";

import { DB, kdb } from "../../../../../db/db";
import { RequestUser } from "../../../../core/model/User";

export const createCorrectionQuery = ({
  correction,
  user,
}: {
  correction: Insertable<DB["correction"]>;
  user: Pick<RequestUser, "id">;
}) => {
  return kdb
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
