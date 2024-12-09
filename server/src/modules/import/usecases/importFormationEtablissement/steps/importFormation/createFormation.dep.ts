import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const createFormation = async (formation: Insertable<DB["formation"]>) =>
  getKbdClient()
    .insertInto("formation")
    .values(formation)
    .onConflict((oc) => oc.column("codeFormationDiplome").doUpdateSet(formation))
    .execute();
