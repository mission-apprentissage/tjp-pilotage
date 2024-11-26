import { getKbdClient } from "@/db/db";

export const findUserQuery = async ({ email }: { email: string }) =>
  getKbdClient().selectFrom("user").select("email").where("email", "=", email).executeTakeFirst();
