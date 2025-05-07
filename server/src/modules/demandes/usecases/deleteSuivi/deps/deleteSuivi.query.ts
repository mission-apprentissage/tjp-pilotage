import { getKbdClient } from "@/db/db";

export const deleteSuiviQuery = async (id: string) =>
  await getKbdClient().deleteFrom("suivi").where("suivi.id", "=", id).executeTakeFirstOrThrow();

