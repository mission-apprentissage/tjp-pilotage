import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findDepartementsQuery = async () => {
  const regions = await getKbdClient().selectFrom("departement").selectAll("departement").execute();
  return regions.map(cleanNull);
};
