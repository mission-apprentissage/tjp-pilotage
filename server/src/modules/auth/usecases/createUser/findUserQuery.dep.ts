import { kdb } from "../../../../db/db";

export const findUserQuery = async ({ email }: { email: string }) =>
  kdb
    .selectFrom("user")
    .select("email")
    .where("email", "=", email)
    .executeTakeFirst();
