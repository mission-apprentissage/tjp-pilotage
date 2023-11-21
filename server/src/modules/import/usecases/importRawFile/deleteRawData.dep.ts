import { kdb } from "../../../../db/db";

export const deleteRawData = async ({ type }: { type: string }) => {
  return await kdb.deleteFrom("rawData").where("type", "=", type).execute();
};
