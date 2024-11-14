import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const createTension = async (data: Insertable<DB["tension"]>) => {
  return getKbdClient()
    .insertInto("tension")
    .values(data)
    .onConflict((oc) => oc.doNothing())
    .execute();
};

export const deleteTension = async () => {
  return getKbdClient().deleteFrom("tension").execute();
};

export const createTensionRome = async (data: Insertable<DB["tensionRome"]>) => {
  return getKbdClient()
    .insertInto("tensionRome")
    .values(data)
    .onConflict((oc) => oc.columns(["annee", "codeRome", "codeTension"]).doUpdateSet(data))
    .execute();
};

export const deleteTensionRome = async () => {
  return getKbdClient().deleteFrom("tensionRome").execute();
};

export const createTensionRomeDepartement = async (data: Insertable<DB["tensionRomeDepartement"]>) => {
  return getKbdClient()
    .insertInto("tensionRomeDepartement")
    .values(data)
    .onConflict((oc) => oc.columns(["annee", "codeDepartement", "codeRome", "codeTension"]).doUpdateSet(data))
    .execute();
};

export const deleteTensionRomeDepartement = async () => {
  return getKbdClient().deleteFrom("tensionRomeDepartement").execute();
};

export const createTensionRomeRegion = async (data: Insertable<DB["tensionRomeRegion"]>) => {
  return getKbdClient()
    .insertInto("tensionRomeRegion")
    .values(data)
    .onConflict((oc) => oc.columns(["annee", "codeRegion", "codeRome", "codeTension"]).doUpdateSet(data))
    .execute();
};

export const deleteTensionRomeRegion = async () => {
  return getKbdClient().deleteFrom("tensionRomeRegion").execute();
};
