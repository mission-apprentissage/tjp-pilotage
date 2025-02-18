import { getKbdClient } from "@/db/db";

export const deleteCampagneRegionQuery = async (id: string) => {
  return await getKbdClient().deleteFrom("campagneRegion").where("campagneRegion.id", "=", id).executeTakeFirstOrThrow();
};
