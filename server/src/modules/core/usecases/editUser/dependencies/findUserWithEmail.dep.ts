import { getKbdClient } from "@/db/db";

export const findDifferentUserWithSameEmail = async ({ email, userId }: { email: string; userId: string }) => {
  const user = await getKbdClient().selectFrom("user").select(["id"]).where(wb => wb.and([wb("email", "=", email), wb("id", "!=", userId)])).executeTakeFirst();
  return user;
};
