import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

const findActionPrioritaire = async ({ offset = 0, limit }: { offset?: number; limit?: number }) =>
  getKbdClient()
    .selectFrom("actionPrioritaire")
    .select(["cfd", "codeRegion", "codeDispositif"])
    .distinct()
    .offset(offset)
    .$call((q) => {
      if (!limit) return q;
      return q.limit(limit);
    })
    .execute();

const createActionsPrioritaires = async (actionsPrioritaires: Insertable<DB["actionPrioritaire"]>) =>
  getKbdClient()
    .insertInto("actionPrioritaire")
    .values(actionsPrioritaires)
    .onConflict((oc) => oc.columns(["cfd", "codeRegion", "codeDispositif"]).doUpdateSet(actionsPrioritaires))
    .execute();

export const importActionPrioritaireDeps = {
  createActionsPrioritaires,
  findActionPrioritaire,
};
