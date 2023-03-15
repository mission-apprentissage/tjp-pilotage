import { db, pool } from "../../../../db/zapatos";
import { FamilleMetier } from "../../entities/FamilleMetier";
import { NMefLine } from "../../files/NMef";

export const createFamillesMetiers = async (famillesMetiers: FamilleMetier[]) =>
  db.upsert("familleMetier", famillesMetiers, "mefStat11Specialite").run(pool);

const findNMef = async ({
  mefstat,
}: {
  mefstat: string;
}): Promise<NMefLine> => {
  return (
    await db
      .selectExactlyOne("rawData", {
        type: "nMef",
        data: db.sql`${db.self}@>${db.param({
          MEF_STAT_11: mefstat,
        })}`,
      })
      .run(pool)
  )?.data as NMefLine;
};

export const importFamillesMetiersDeps = {
  createFamillesMetiers,
  findNMef,
};
