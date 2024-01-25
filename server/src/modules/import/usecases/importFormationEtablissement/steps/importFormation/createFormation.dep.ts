import { Insertable } from "kysely";

import { DB, kdb } from "../../../../../../db/db";

export const createFormation = async (formation: Insertable<DB["formation"]>) =>
  kdb
    .insertInto("formation")
    .values(formation)
    .onConflict((oc) =>
      oc.column("codeFormationDiplome").doUpdateSet(formation)
    )
    .execute();
