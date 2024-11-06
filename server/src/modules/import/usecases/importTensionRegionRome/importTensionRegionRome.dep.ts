import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const createTension = async (data: Insertable<DB["tension"]>) => {
  return kdb
    .insertInto("tension")
    .values(data)
    .onConflict((oc) => oc.doNothing())
    .execute();
};

export const createTensionRegionRome = async (
  data: Insertable<DB["tensionRomeRegion"]>
) => {
  return kdb
    .insertInto("tensionRomeRegion")
    .values(data)
    .onConflict((oc) =>
      oc
        .columns(["annee", "codeRegion", "codeRome", "codeTension"])
        .doUpdateSet(data)
    )
    .execute();
};

export const deleteTensionRegionRome = async () => {
  return kdb.deleteFrom("tensionRomeRegion").execute();
};
