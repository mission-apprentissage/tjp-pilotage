import { sql } from "kysely";

import { getKbdClient } from "@/db/db";
import type { Constat } from "@/modules/import/fileTypes/Constat";

export const findConstatRentrees = async ({ mefStat11, year }: { mefStat11: string; year: string }) => {
  return (
    await getKbdClient()
      .selectFrom("rawData")
      .selectAll("rawData")
      .where("type", "=", `constat_${year}`)
      .where("data", "@>", {
        "Mef Bcp 11": mefStat11,
      })
      .innerJoin("dataEtablissement", (join) => join.onRef("dataEtablissement.uai", "=", sql`"data"->>'UAI'`))
      .where("dataEtablissement.codeRegion", "not in", ["00", "99"])
      .execute()
  ).map((item) => item.data as Constat);
};
