import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findUserQuery = async ({ email }: { email: string }) => {
  const user = await getKbdClient().selectFrom("user").selectAll().where("email", "=", email).executeTakeFirst();

  return user && cleanNull(user);
};
