import { Insertable } from "kysely";

import { DB, kdb } from "../../../../../../db/db";

export const upsertIndicateurEtablissement = async (
  indicateurEtablissement: Insertable<DB["indicateurEtablissement"]>
) => {
  await kdb
    .insertInto("indicateurEtablissement")
    .values(indicateurEtablissement)
    .onConflict((oc) =>
      oc.column("UAI").column("millesime").doUpdateSet(indicateurEtablissement)
    )
    .execute();
};
