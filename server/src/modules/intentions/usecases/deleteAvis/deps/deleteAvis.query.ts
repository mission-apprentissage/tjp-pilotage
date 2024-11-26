import { getKbdClient } from "@/db/db";

export const deleteAvisQuery = async (id: string) => {
  return await getKbdClient().deleteFrom("avis").where("avis.id", "=", id).executeTakeFirstOrThrow();
};
