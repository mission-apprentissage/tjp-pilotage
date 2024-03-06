import { kdb } from "../../../../db/db";

type RawData = { type: string; data: JSON };

export const createRawDatas = async ({ data }: { data: Array<RawData> }) => {
  return await kdb
    .insertInto("rawData")
    .values(data.map((item) => ({ ...item, data: JSON.stringify(item.data) })))
    .execute();
};
