import { kdb } from "../../../../../db/db";

export const deleteAvisQuery = async (id: string) => {
  return await kdb
    .deleteFrom("avis")
    .where("avis.id", "=", id)
    .executeTakeFirstOrThrow();
};
