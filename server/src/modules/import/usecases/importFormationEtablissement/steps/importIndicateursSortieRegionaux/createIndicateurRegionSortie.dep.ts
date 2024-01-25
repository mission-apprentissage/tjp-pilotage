import { Insertable } from "kysely";

import { DB, kdb } from "../../../../../../db/db";

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
