import { kdb } from "../../../../../db/db";

export const deleteSuiviQuery = async (id: string) => {
  return await kdb
    .deleteFrom("suivi")
    .where("suivi.id", "=", id)
    .executeTakeFirstOrThrow();
};
