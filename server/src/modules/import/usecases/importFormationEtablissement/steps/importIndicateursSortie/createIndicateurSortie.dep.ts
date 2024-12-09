import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const createIndicateurSortie = async (indicateurSortie: Insertable<DB["indicateurSortie"]>) => {
  await getKbdClient()
    .insertInto("indicateurSortie")
    .values(indicateurSortie)
    .onConflict((oc) => oc.column("formationEtablissementId").column("millesimeSortie").doUpdateSet(indicateurSortie))
    .execute();
};
