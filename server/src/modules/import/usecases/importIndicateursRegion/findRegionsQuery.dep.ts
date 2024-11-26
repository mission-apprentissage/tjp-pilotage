import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findRegionsQuery = async () => {
  const regions = await getKbdClient().selectFrom("region").selectAll("region").execute();
  return regions.map(cleanNull);
};
