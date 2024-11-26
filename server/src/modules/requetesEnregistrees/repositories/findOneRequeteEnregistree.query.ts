import { getKbdClient } from "@/db/db";

export const findOneRequeteEnregistreeQuery = async (id: string) => {
  return await getKbdClient()
    .selectFrom("requeteEnregistree")
    .selectAll()
    .where("requeteEnregistree.id", "=", id)
    .executeTakeFirst();
};
