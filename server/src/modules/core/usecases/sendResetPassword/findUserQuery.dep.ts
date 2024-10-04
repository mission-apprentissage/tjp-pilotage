import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findUserQuery = async ({ email }: { email: string }) => {
  const user = await kdb
    .selectFrom("user")
    .where("user.email", "=", email)
    .where("enabled", "=", true)
    .select(["email", "password", "firstname", "lastname", "sub"])
    .executeTakeFirst();

  return user && cleanNull(user);
};
