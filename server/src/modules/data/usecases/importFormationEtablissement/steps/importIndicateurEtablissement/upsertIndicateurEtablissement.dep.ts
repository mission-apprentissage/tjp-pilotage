import { Insertable } from "kysely";

import { kdb } from "../../../../../../db/db";
import { DB } from "../../../../../../db/schema";

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
