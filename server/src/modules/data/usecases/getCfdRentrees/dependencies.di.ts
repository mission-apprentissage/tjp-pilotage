import { db, pool } from "../../../../db/zapatos";
import { Cab_bre_division_effectifs_par_etab_mefst11 } from "../../files/Cab-nbre_division_effectifs_par_etab_mefst11";
import { NMefLine } from "../../files/NMef";

const findContratRentrees = async ({ mefStat11 }: { mefStat11: string }) => {
  return (
    await db
      .select("rawData", {
        type: "Cab-nbre_division_effectifs_par_etab_mefst11",
        data: db.sql`${db.self}@>${db.param({
          "Mef Bcp 11": mefStat11,
        })}`,
      })
      .run(pool)
  ).map((item) => item.data as Cab_bre_division_effectifs_par_etab_mefst11);
};

const findNMefs = async ({ cfd }: { cfd: string }) =>
  (
    await db
      .select("rawData", {
        type: "nMef",
        data: db.sql`${db.self}@>${db.param({
          FORMATION_DIPLOME: cfd,
        })}`,
      })
      .run(pool)
  ).map((item) => item.data as NMefLine);

export const dependencies = {
  findContratRentrees,
  findNMefs,
};
