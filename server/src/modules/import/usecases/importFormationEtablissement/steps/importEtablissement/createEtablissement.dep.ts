import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const createEtablissement = async (etablissement: Insertable<DB["etablissement"]>) =>
  getKbdClient()
    .insertInto("etablissement")
    .values(etablissement)
    .onConflict((oc) => oc.column("uai").doUpdateSet(etablissement))
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(cleanNull);
