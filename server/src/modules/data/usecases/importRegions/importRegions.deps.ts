import { db, pool } from "../../../../db/zapatos";
import { Region } from "../../entities/Region";

const createRegions = async (regions: Region[]) => {
  await db.upsert("region", regions, ["id"]).run(pool);
};

export const importRegionsDeps = { createRegions };
