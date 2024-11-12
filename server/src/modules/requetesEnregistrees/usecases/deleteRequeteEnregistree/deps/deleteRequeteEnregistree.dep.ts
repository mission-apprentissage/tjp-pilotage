import { kdb } from "../../../../../db/db";

export const deleteRequeteEnregistreeQuery = async (id: string) => {
  return await kdb
    .deleteFrom("requeteEnregistree")
    .where("requeteEnregistree.id", "=", id)
    .executeTakeFirstOrThrow();
};
