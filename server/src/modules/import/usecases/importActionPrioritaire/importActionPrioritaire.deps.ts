import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const deleteActionPrioritaire = async () => {
  return getKbdClient().deleteFrom("actionPrioritaire").execute();
};

const createActionsPrioritaires = async (actionsPrioritaires: Insertable<DB["actionPrioritaire"]>) =>
  getKbdClient()
    .insertInto("actionPrioritaire")
    .values(actionsPrioritaires)
    .onConflict((oc) => oc.columns(["cfd", "codeRegion", "codeDispositif"]).doUpdateSet(actionsPrioritaires))
    .execute();

export const importActionPrioritaireDeps = {
  createActionsPrioritaires,
  deleteActionPrioritaire,
};
