import { getKbdClient } from "@/db/db";

export const getCampagneRegionQuery = async (id: string) => {
  return await getKbdClient().selectFrom("campagneRegion").selectAll().where("campagneRegion.id", "=", id).executeTakeFirstOrThrow();
};
