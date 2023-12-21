import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const createDataFormation = async (
  dataFormation: Insertable<DB["dataFormation"]>
) => {
  await kdb
    .insertInto("dataFormation")
    .values(dataFormation)
    .onConflict((oc) => oc.column("cfd").doUpdateSet(dataFormation))
    .execute();
};
