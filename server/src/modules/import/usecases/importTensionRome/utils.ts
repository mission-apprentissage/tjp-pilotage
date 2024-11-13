import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const createTension = async (data: Insertable<DB["tension"]>) => {
  return kdb
    .insertInto("tension")
    .values(data)
    .onConflict((oc) => oc.doNothing())
    .execute();
};

export const deleteTension = async () => {
  return kdb.deleteFrom("tension").execute();
};

export const createTensionRome = async (
  data: Insertable<DB["tensionRome"]>
) => {
  return kdb
    .insertInto("tensionRome")
    .values(data)
    .onConflict((oc) =>
      oc.columns(["annee", "codeRome", "codeTension"]).doUpdateSet(data)
    )
    .execute();
};

export const deleteTensionRome = async () => {
  return kdb.deleteFrom("tensionRome").execute();
};

export const createTensionRomeDepartement = async (
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

export const deleteTensionRomeDepartement = async () => {
  return kdb.deleteFrom("tensionRomeDepartement").execute();
};

export const createTensionRomeRegion = async (
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

export const deleteTensionRomeRegion = async () => {
  return kdb.deleteFrom("tensionRomeRegion").execute();
};
