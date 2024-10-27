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

export const createTensionDepartementRome = async (data: Insertable<DB["tensionRomeDepartement"]>) => {
  return getKbdClient()
    .insertInto("tensionRomeDepartement")
    .values(data)
    .onConflict((oc) => oc.columns(["annee", "codeDepartement", "codeRome", "codeTension"]).doUpdateSet(data))
    .execute();
};

export const deleteTension = async () => {
  return getKbdClient().deleteFrom("tension").execute();
};

export const deleteTensionDepartementRome = async () => {
  return getKbdClient().deleteFrom("tensionRomeDepartement").execute();
};
