import type { Insertable } from "kysely";

import { getKbdClient } from "@/db/db";
import type { DB } from "@/db/schema";

export const createConstatRentree = async (constatRentree: Insertable<DB["constatRentree"]>) => {
  await getKbdClient()
    .insertInto("constatRentree")
    .values(constatRentree)
    .onConflict((oc) => oc.columns(["uai", "mefstat11", "rentreeScolaire"]).doUpdateSet(constatRentree))
    .execute();
};
