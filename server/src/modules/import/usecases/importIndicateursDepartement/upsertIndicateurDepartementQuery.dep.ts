import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const upsertDepartementQuery = async (indicateurDepartement: Insertable<DB["indicateurDepartement"]>) => {
  await getKbdClient()
    .insertInto("indicateurDepartement")
    .values(indicateurDepartement)
    .onConflict((oc) => oc.column("codeDepartement").column("rentreeScolaire").doUpdateSet(indicateurDepartement))
    .execute();
};
