import { LyceesACCELine } from "../../../../../public/files/LyceesACCELine";
import { kdb } from "../../../../db/db";

export const findInLyccesACCE = async ({ uai }: { uai: string }) => {
  const line = await kdb
    .selectFrom("rawData")
    .selectAll()
    .where("data", "@>", { numero_uai: uai })
    .executeTakeFirst();

  return line?.data as LyceesACCELine;
};
