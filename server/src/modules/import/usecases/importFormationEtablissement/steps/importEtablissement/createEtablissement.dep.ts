import { Insertable } from "kysely";

import { DB, kdb } from "../../../../../../db/db";
import { cleanNull } from "../../../../../../utils/noNull";

export const createEtablissement = async (
  etablissement: Insertable<DB["etablissement"]>
) =>
  kdb
    .insertInto("etablissement")
    .values(etablissement)
    .onConflict((oc) => oc.column("uai").doUpdateSet(etablissement))
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(cleanNull);
