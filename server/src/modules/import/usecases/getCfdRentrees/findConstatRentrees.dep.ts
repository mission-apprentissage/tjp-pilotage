import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { Constat } from "../../fileTypes/Constat";

export const findConstatRentrees = async ({
  mefStat11,
  year,
}: {
  mefStat11: string;
  year: string;
}) => {
  return (
    await kdb
      .selectFrom("rawData")
      .selectAll("rawData")
      .where(
        "type",
        "=",
        `constat_${year}`
      )
      .where("data", "@>", {
        "Mef Bcp 11": mefStat11,
      })
      .innerJoin("dataEtablissement", (join) =>
        join.onRef(
          "dataEtablissement.uai",
          "=",
          sql`"data"->>'Numéro d''établissement'`
        )
      )
      .where("dataEtablissement.codeRegion", "not in", ["00", "99"])
      .execute()
  ).map((item) => item.data as Constat);
};
