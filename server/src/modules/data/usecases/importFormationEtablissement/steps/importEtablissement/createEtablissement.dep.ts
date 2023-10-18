import { Insertable } from "kysely";

import { kdb } from "../../../../../../db/db";
import { DB } from "../../../../../../db/schema";
import { cleanNull } from "../../../../../../utils/noNull";

export const createEtablissement = async (
  etablissement: Insertable<DB["etablissement"]>
) =>
  await kdb
    .insertInto("etablissement")
    .values(etablissement)
    .onConflict((oc) => oc.column("UAI").doUpdateSet(etablissement))
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(cleanNull);
