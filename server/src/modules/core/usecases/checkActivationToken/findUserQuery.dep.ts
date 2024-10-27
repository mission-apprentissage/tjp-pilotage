import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findUserQuery = async ({ email }: { email: string }) => {
  const user = await getKbdClient()
    .selectFrom("user")
    .where("user.email", "=", email)
    .where("user.enabled", "=", true)
    .select(["email", "password"])
    .executeTakeFirst();

  return user && cleanNull(user);
};
