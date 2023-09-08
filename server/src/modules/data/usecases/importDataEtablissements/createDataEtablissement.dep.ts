import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

export const createDataEtablissement = async (
  dataEtablissement: Insertable<DB["dataEtablissement"]>
) => {
  await kdb
    .insertInto("dataEtablissement")
    .values(dataEtablissement)
    .onConflict((oc) => oc.column("uai").doUpdateSet(dataEtablissement))
    .execute();
};
