import { Insertable } from "kysely";

import { kdb } from "../../../../../../db/db";
import { DB } from "../../../../../../db/schema";

export const createIndicateurRegionSortie = async (
  indicateurRegionSortie: Insertable<DB["indicateurRegionSortie"]>
) =>
  kdb
    .insertInto("indicateurRegionSortie")
    .values(indicateurRegionSortie)
    .onConflict((oc) =>
      oc
        .column("cfd")
        .column("codeRegion")
        .column("dispositifId")
        .column("voie")
        .column("millesimeSortie")
        .doUpdateSet(indicateurRegionSortie)
    )
    .execute();
