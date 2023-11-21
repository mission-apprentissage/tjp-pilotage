import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findAcademiesQuery = async () => {
  const regions = await kdb
    .selectFrom("academie")
    .selectAll("academie")
    .execute();
  return regions.map(cleanNull);
};
