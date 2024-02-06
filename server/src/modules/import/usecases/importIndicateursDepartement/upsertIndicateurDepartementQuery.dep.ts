import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const upsertDepartementQuery = async (
  indicateurDepartement: Insertable<DB["indicateurDepartement"]>
) => {
  await kdb
    .insertInto("indicateurDepartement")
    .values(indicateurDepartement)
    .onConflict((oc) =>
      oc
        .column("codeDepartement")
        .column("rentreeScolaire")
        .doUpdateSet(indicateurDepartement)
    )
    .execute();
};
