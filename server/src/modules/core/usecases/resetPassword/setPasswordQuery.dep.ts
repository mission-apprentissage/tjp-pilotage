import { getKbdClient } from "@/db/db";

export const setPasswordQuery = async ({ email, password }: { email: string; password: string }) => {
  await getKbdClient()
    .updateTable("user")
    .where("user.email", "=", email)
    .where("user.enabled", "=", true)
    .set({ password })
    .execute();
};
