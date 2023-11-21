import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findRegionsQuery = async () => {
  const regions = await kdb.selectFrom("region").selectAll("region").execute();
  return regions.map(cleanNull);
};
