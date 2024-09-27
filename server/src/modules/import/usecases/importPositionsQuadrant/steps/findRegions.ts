import { kdb } from "../../../../../db/db";

export const findRegions = async () =>
  await kdb.selectFrom("region").select(["codeRegion"]).execute();
