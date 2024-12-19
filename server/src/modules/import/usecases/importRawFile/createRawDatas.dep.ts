import { getKbdClient } from "@/db/db";

export type RawDataLine = { [key: string]: string };
export type RawData = { type: string; data: RawDataLine };

export const createRawDatas = async ({ data }: { data: Array<RawData> }) => {
  return await getKbdClient()
    .insertInto("rawData")
    .values(data.map((item) => ({ ...item, data: JSON.stringify(item.data) })))
    .execute();
};
