import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const upsertIndicateurAcaemieQuery = async (
  indicateurAcademie: Insertable<DB["indicateurAcademie"]>
) => {
  await kdb
    .insertInto("indicateurAcademie")
    .values(indicateurAcademie)
    .onConflict((oc) =>
      oc
        .column("codeAcademie")
        .column("rentreeScolaire")
        .doUpdateSet(indicateurAcademie)
    )
    .execute();
};
