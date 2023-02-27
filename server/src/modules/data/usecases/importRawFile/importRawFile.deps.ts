import { JSONValue } from "zapatos/db";

import { db, pool } from "../../../../db/zapatos";

export const createRawDatas = async ({
  data,
}: {
  data: { type: string; data: JSONValue }[];
}) => {
  return await db.insert("rawData", data).run(pool);
};

export const deleteRawData = async ({ type }: { type: string }) => {
  return await db.deletes("rawData", { type }).run(pool);
};

export const importRawFileDeps = { createRawDatas, deleteRawData };
