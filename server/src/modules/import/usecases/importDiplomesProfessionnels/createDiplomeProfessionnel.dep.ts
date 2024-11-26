import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const createDiplomeProfessionnel = async (diplomeProfessionnel: Insertable<DB["diplomeProfessionnel"]>) => {
  await getKbdClient()
    .insertInto("diplomeProfessionnel")
    .values(diplomeProfessionnel)
    .onConflict((oc) => oc.columns(["cfd", "voie"]).doUpdateSet(diplomeProfessionnel))
    .execute();
};
