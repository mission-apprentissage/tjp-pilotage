import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const createFormationEtablissement = async (formationEtablissement: Insertable<DB["formationEtablissement"]>) =>
  await getKbdClient()
    .insertInto("formationEtablissement")
    .values(formationEtablissement)
    .onConflict((oc) =>
      oc.column("uai").column("cfd").column("codeDispositif").column("voie").doUpdateSet(formationEtablissement),
    )
    .returningAll()
    .executeTakeFirstOrThrow();
