import { getKbdClient } from "@/db/db";

export const findOneAvisQuery = async (id: string) => {
  return await getKbdClient().selectFrom("avis").selectAll().where("avis.id", "=", id).executeTakeFirst();
};
