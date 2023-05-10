import { kdb } from "../../../../db/db";
import { Cab_bre_division_effectifs_par_etab_mefst11 } from "../../files/Cab-nbre_division_effectifs_par_etab_mefst11";
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
      .execute()
  ).map((item) => item.data as Cab_bre_division_effectifs_par_etab_mefst11);
};
