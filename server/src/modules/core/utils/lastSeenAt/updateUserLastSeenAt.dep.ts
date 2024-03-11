import { kdb } from "../../../../db/db";

export const updateUserLastSeenAt = async ({ email }: { email: string }) => {
  await kdb
    .updateTable("user")
    .where("email", "=", email)
    .where("enabled", "=", true)
    .set("lastSeenAt", new Date())
    .executeTakeFirst();
};
