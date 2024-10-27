import { getKbdClient } from "@/db/db";

export const updateUserQuery = async ({ email, password }: { email: string; password: string }) => {
  await getKbdClient().updateTable("user").where("user.email", "=", email).set({ password, enabled: true }).execute();
};
