import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

export const createConstatRentree = async (
  constatRentree: Insertable<DB["constatRentree"]>
) => {
  await kdb
    .insertInto("constatRentree")
    .values(constatRentree)
    .onConflict((oc) =>
      oc
        .columns(["uai", "mefstat11", "rentreeScolaire"])
        .doUpdateSet(constatRentree)
    )
    .execute();
};
