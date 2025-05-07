import { getKbdClient } from "@/db/db";

export const findOneSuiviQuery = async (id: string) =>
  await getKbdClient().selectFrom("suivi").selectAll().where("suivi.id", "=", id).executeTakeFirst();

