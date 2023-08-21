import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { NMefLine } from "../../../../../public/files/NMef";

export const createFamillesMetiers = async (
  famillesMetier: Insertable<DB["familleMetier"]>
) =>
  kdb
    .insertInto("familleMetier")
    .values(famillesMetier)
    .onConflict((oc) =>
      oc.column("mefStat11Specialite").doUpdateSet(famillesMetier)
    )
    .execute();

const findNMef = async ({
  mefstat,
}: {
  mefstat: string;
}): Promise<NMefLine> => {
  return (
    await kdb
      .selectFrom("rawData")
      .selectAll("rawData")
      .where("type", "=", "nMef")
      .where("data", "@>", {
        MEF_STAT_11: mefstat,
      })
      .executeTakeFirst()
  )?.data as NMefLine;
};

export const importFamillesMetiersDeps = {
  createFamillesMetiers,
  findNMef,
};
