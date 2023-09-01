import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { LyceesACCELine } from "../../../data/fileTypes/LyceesACCELine";

export const findManyInLyceesACCE = async ({ search }: { search: string }) => {
  const lines = await kdb
    .selectFrom("rawData")
    .selectAll()
    .where((eb) =>
      eb.or([
        eb(sql`"data"->>'numero_uai'`, "ilike", `${search}%`),
        eb(sql`"data"->>'appellation_officielle'`, "ilike", `%${search}%`),
        eb(sql`"data"->>'commune_libe'`, "ilike", `%${search}%`),
      ])
    )
    .limit(10)
    .execute();
  return lines.map((line) => line?.data) as LyceesACCELine[];
};
