import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

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
