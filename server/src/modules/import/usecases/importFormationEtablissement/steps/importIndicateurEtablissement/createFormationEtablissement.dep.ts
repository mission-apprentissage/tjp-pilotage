import { Insertable } from "kysely";

import { kdb } from "../../../../../../db/db";
import { DB } from "../../../../../../db/schema";

export const createFormationEtablissement = async (
  formationEtablissement: Insertable<DB["formationEtablissement"]>
) =>
  await kdb
    .insertInto("formationEtablissement")
    .values(formationEtablissement)
    .onConflict((oc) =>
      oc
        .column("UAI")
        .column("cfd")
        .column("dispositifId")
        .column("voie")
        .doUpdateSet(formationEtablissement)
    )
    .returningAll()
    .executeTakeFirstOrThrow();
