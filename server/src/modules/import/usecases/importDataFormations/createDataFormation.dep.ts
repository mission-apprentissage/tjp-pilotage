import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

export const createDataFormation = async (
  dataFormation: Insertable<DB["dataFormation"]>
) => {
  await kdb
    .insertInto("dataFormation")
    .values(dataFormation)
    .onConflict((oc) => oc.column("cfd").doUpdateSet(dataFormation))
    .execute();
};
