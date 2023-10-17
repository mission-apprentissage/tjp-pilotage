import { Insertable } from "kysely";

import { kdb } from "../../../../../../db/db";
import { DB } from "../../../../../../db/schema";

export const createIndicateurSortie = async (
  indicateurSortie: Insertable<DB["indicateurSortie"]>
) => {
  await kdb
    .insertInto("indicateurSortie")
    .values(indicateurSortie)
    .onConflict((oc) =>
      oc
        .column("formationEtablissementId")
        .column("millesimeSortie")
        .doUpdateSet(indicateurSortie)
    )
    .execute();
};
