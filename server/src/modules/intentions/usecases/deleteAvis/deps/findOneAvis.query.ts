import { kdb } from "../../../../../db/db";

export const findOneAvisQuery = async (id: string) => {
  return await kdb
    .selectFrom("avis")
    .selectAll()
    .where("avis.id", "=", id)
    .executeTakeFirst();
};
