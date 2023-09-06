import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { LyceesACCELine } from "../../../data/fileTypes/LyceesACCELine";

export const findManyInLyceesACCE = async ({ uai }: { uai: string }) => {
  const lines = await kdb
    .selectFrom("rawData")
    .selectAll()
    .where(sql`"data"->>'numero_uai'`, "like", `${uai}%`)
    .limit(10)
    .execute();
  return lines.map((line) => line?.data) as LyceesACCELine[];
};
