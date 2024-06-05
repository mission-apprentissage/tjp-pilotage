import { kdb } from "../../../../../db/db";

export const findOneSuiviQuery = async (id: string) => {
  return await kdb
    .selectFrom("suivi")
    .selectAll()
    .where("suivi.id", "=", id)
    .executeTakeFirst();
};
