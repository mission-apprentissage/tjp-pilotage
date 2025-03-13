import { getKbdClient } from "@/db/db";

export const findUser = async ({ userId }: { userId: string }) => getKbdClient().selectFrom("user").select(["id", "email"]).where("id", "=", userId).executeTakeFirst();
