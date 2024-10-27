import { getKbdClient } from "@/db/db";

export const updateUserLastSeenAt = async ({ email }: { email: string }) => {
  await getKbdClient()
    .updateTable("user")
    .where("email", "=", email)
    .where("enabled", "=", true)
    .set("lastSeenAt", new Date())
    .executeTakeFirst();
};
