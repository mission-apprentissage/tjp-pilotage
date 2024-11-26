import { getKbdClient } from "@/db/db";

export const deleteRawData = async ({ type }: { type: string }) => {
  return await getKbdClient().deleteFrom("rawData").where("type", "=", type).execute();
};
