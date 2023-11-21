import { kdb } from "../../../../db/db";

export const createRawDatas = async ({
  data,
}: {
  data: { type: string; data: JSON }[];
}) => {
  return await kdb
    .insertInto("rawData")
    .values(data.map((item) => ({ ...item, data: JSON.stringify(item.data) })))
    .execute();
};