import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findUserQuery = (email: string) =>
  kdb
    .selectFrom("user")
    .where("email", "=", email)
    .executeTakeFirst()
    .then(cleanNull);
