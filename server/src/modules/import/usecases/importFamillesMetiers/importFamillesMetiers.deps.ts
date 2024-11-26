import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import type { NMefLine } from "@/modules/import/fileTypes/NMef";

const findFamillesMetiers = async ({ offset = 0, limit }: { offset?: number; limit?: number }) =>
  getKbdClient()
    .selectFrom("familleMetier")
    .select(["cfdFamille", "libelleFamille", "codeMinistereTutelle"])
    .distinct()
    .offset(offset)
    .$call((q) => {
      if (!limit) return q;
      return q.limit(limit);
    })
    .execute();

const createFamillesMetiers = async (famillesMetier: Insertable<DB["familleMetier"]>) =>
  getKbdClient()
    .insertInto("familleMetier")
    .values(famillesMetier)
    .onConflict((oc) => oc.column("cfd").doUpdateSet(famillesMetier))
    .execute();

const findNMef = async ({ mefstat }: { mefstat: string }): Promise<NMefLine> => {
  return (
    await getKbdClient()
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
  findFamillesMetiers,
};
