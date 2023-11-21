import { Insertable } from "kysely";

import { kdb } from "../../../../../../db/db";
import { DB } from "../../../../../../db/schema";

export const createFormation = async (formation: Insertable<DB["formation"]>) =>
  kdb
    .insertInto("formation")
    .values(formation)
    .onConflict((oc) =>
      oc.column("codeFormationDiplome").doUpdateSet(formation)
    )
    .execute();
