import { IsolationLevel } from "zapatos/db";

import { db, pool } from "../../../../db/zapatos";
import { Region } from "../../entities/Region";

export const createRegions = async (regions: Region[]) => {
  await db.transaction(pool, IsolationLevel.Serializable, async (tr) => {
    await db.upsert("region", regions, ["id"]).run(tr);
  });
};
