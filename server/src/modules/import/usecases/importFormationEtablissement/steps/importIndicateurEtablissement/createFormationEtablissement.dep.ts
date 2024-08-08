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
        .column("uai")
        .column("cfd")
        .column("codeDispositif")
        .column("voie")
        .doUpdateSet(formationEtablissement)
    )
    .returningAll()
    .executeTakeFirstOrThrow();
