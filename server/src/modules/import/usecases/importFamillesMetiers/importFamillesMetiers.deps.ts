import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";
import { NMefLine } from "../../fileTypes/NMef";

export const createFamillesMetiers = async (
  famillesMetier: Insertable<DB["familleMetier"]>
) =>
  kdb
    .insertInto("familleMetier")
    .values(famillesMetier)
    .onConflict((oc) => oc.column("cfdSpecialite").doUpdateSet(famillesMetier))
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
