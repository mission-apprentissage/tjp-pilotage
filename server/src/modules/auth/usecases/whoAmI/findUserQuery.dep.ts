import { kdb } from "../../../../db/db";

export const findUserQuery = async ({ email }: { email: string }) => {
  return await kdb
    .selectFrom("user")
    .select(["id", "email"])
    .where("email", "=", email)
    .executeTakeFirst();
};
