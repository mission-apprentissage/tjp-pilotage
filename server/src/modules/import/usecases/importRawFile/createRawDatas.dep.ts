import { getKbdClient } from "@/db/db";

export type RawData = { type: string; data: JSON };

export const createRawDatas = async ({ data }: { data: Array<RawData> }) => {
  return await getKbdClient()
    .insertInto("rawData")
    .values(data.map((item) => ({ ...item, data: JSON.stringify(item.data) })))
    .execute();
};
