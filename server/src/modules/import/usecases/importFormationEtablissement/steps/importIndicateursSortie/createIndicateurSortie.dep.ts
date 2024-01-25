import { Insertable } from "kysely";

import { DB, kdb } from "../../../../../../db/db";

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
