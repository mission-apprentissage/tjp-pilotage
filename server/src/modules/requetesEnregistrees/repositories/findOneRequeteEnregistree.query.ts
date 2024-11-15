import { kdb } from "../../../db/db";

export const findOneRequeteEnregistreeQuery = async (id: string) => {
  return await kdb
    .selectFrom("requeteEnregistree")
    .selectAll()
    .where("requeteEnregistree.id", "=", id)
    .executeTakeFirst();
};
