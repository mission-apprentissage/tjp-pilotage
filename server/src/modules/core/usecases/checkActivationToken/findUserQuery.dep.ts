import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findUserQuery = async ({ email }: { email: string }) => {
  const user = await kdb
    .selectFrom("user")
    .where("user.email", "=", email)
    .select(["email", "password"])
    .executeTakeFirst();

  return user && cleanNull(user);
};
