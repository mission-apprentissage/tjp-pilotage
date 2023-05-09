import { kdb } from "../../../../db/db";
import { Cab_bre_division_effectifs_par_etab_mefst11 } from "../../files/Cab-nbre_division_effectifs_par_etab_mefst11";
import { NMefLine } from "../../files/NMef";

const findContratRentrees = async ({ mefStat11 }: { mefStat11: string }) => {
  return (
    await kdb
      .selectFrom("rawData")
      .selectAll("rawData")
      .where("type", "=", "Cab-nbre_division_effectifs_par_etab_mefst11")
      .where("data", "@>", {
        "Mef Bcp 11": mefStat11,
      })
      .execute()
  ).map((item) => item.data as Cab_bre_division_effectifs_par_etab_mefst11);
};

const findNMefs = async ({ cfd }: { cfd: string }) =>
  (
    await kdb
      .selectFrom("rawData")
      .selectAll("rawData")
      .where("type", "=", "nMef")
      .where("data", "@>", {
        FORMATION_DIPLOME: cfd,
      })
      .execute()
  ).map((item) => item.data as NMefLine);

export const dependencies = {
  findContratRentrees,
  findNMefs,
};
