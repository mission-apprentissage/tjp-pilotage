import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const upsertIndicateurEtablissement = async (
  indicateurEtablissement: Insertable<DB["indicateurEtablissement"]>
) => {
  await getKbdClient()
    .insertInto("indicateurEtablissement")
    .values(indicateurEtablissement)
    .onConflict((oc) => oc.column("uai").column("millesime").doUpdateSet(indicateurEtablissement))
    .execute();
};
