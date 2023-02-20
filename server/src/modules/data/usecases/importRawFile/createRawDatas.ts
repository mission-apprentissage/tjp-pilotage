import { JSONValue } from "zapatos/db";

import { db, pool } from "../../../../db/zapatos";

export const createRawDatas = async ({
  data,
}: {
  data: { type: string; key: string; data: JSONValue }[];
}) => {
  return await db.upsert("rawData", data, ["key", "type"]).run(pool);
};
