import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const createDataEtablissement = async (
  dataEtablissement: Insertable<DB["dataEtablissement"]>
) => {
  await kdb
    .insertInto("dataEtablissement")
    .values(dataEtablissement)
    .onConflict((oc) => oc.column("uai").doUpdateSet(dataEtablissement))
    .execute();
};
