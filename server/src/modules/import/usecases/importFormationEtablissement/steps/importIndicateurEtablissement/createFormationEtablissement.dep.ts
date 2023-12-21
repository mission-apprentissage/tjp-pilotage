import { Insertable } from "kysely";

import { DB, kdb } from "../../../../../../db/db";

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
