import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findDepartementsQuery = async () => {
  const regions = await kdb.selectFrom("departement").selectAll("departement").execute();
  return regions.map(cleanNull);
};
