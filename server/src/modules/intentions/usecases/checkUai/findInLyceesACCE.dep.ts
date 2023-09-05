import { kdb } from "../../../../db/db";
import { LyceesACCELine } from "../../../data/fileTypes/LyceesACCELine";

export const findInLyceesACCE = async ({ uai }: { uai: string }) => {
  const line = await kdb
    .selectFrom("rawData")
    .selectAll()
    .where("data", "@>", { numero_uai: uai })
    .executeTakeFirst();

  return line?.data as LyceesACCELine;
};
