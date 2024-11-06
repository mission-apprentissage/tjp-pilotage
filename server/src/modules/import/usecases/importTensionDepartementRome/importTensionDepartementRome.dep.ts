import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const createTension = async (data: Insertable<DB["tension"]>) => {
  return kdb
    .insertInto("tension")
    .values(data)
    .onConflict((oc) => oc.doNothing())
    .execute();
};

export const createTensionDepartementRome = async (
  data: Insertable<DB["tensionRomeDepartement"]>
) => {
  return kdb
    .insertInto("tensionRomeDepartement")
    .values(data)
    .onConflict((oc) =>
      oc
        .columns(["annee", "codeDepartement", "codeRome", "codeTension"])
        .doUpdateSet(data)
    )
    .execute();
};

export const deleteTensionDepartementRome = async () => {
  return kdb.deleteFrom("tensionRomeDepartement").execute();
};
