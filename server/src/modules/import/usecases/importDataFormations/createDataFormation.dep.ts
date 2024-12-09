import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const createDataFormation = async (dataFormation: Insertable<DB["dataFormation"]>) => {
  await getKbdClient()
    .insertInto("dataFormation")
    .values(dataFormation)
    .onConflict((oc) => oc.column("cfd").doUpdateSet(dataFormation))
    .execute();
};
