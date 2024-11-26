import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findUserQuery = async (email: string) =>
  getKbdClient().selectFrom("user").selectAll().where("email", "=", email).executeTakeFirst().then(cleanNull);
