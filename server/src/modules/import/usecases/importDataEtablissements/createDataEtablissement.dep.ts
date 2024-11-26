import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const createDataEtablissement = async (dataEtablissement: Insertable<DB["dataEtablissement"]>) => {
  await getKbdClient()
    .insertInto("dataEtablissement")
    .values(dataEtablissement)
    .onConflict((oc) => oc.column("uai").doUpdateSet(dataEtablissement))
    .execute();
};
