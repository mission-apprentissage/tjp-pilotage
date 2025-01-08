import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const createIndicateurRegionSortie = async (indicateurRegionSortie: Insertable<DB["indicateurRegionSortie"]>) =>
  getKbdClient()
    .insertInto("indicateurRegionSortie")
    .values(indicateurRegionSortie)
    .onConflict((oc) =>
      oc
        .column("cfd")
        .column("codeRegion")
        .column("codeDispositif")
        .column("voie")
        .column("millesimeSortie")
        .doUpdateSet(indicateurRegionSortie),
    )
    .execute();
