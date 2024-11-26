import { getKbdClient } from "@/db/db";

export const deleteRequeteEnregistreeQuery = async (id: string) => {
  return await getKbdClient()
    .deleteFrom("requeteEnregistree")
    .where("requeteEnregistree.id", "=", id)
    .executeTakeFirstOrThrow();
};
