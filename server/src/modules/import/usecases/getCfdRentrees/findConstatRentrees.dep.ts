import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { Cab_bre_division_effectifs_par_etab_mefst11 } from "../../fileTypes/Cab-nbre_division_effectifs_par_etab_mefst11";

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
        `Cab-nbre_division_effectifs_par_etab_mefst11_${year}`
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
  ).map((item) => item.data as Cab_bre_division_effectifs_par_etab_mefst11);
};
