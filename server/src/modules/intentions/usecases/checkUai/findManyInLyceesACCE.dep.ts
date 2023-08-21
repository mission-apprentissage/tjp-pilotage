import { sql } from "kysely";

import { LyceesACCELine } from "../../../../../public/files/LyceesACCELine";
import { kdb } from "../../../../db/db";

export const findManyInLyccesACCE = async ({ uai }: { uai: string }) => {
  const lines = await kdb
    .selectFrom("rawData")
    .selectAll()
    .where(sql`"data"->>'numero_uai'`, "like", `${uai}%`)
    .limit(10)
    .execute();
  return lines.map((line) => line?.data) as LyceesACCELine[];
};
