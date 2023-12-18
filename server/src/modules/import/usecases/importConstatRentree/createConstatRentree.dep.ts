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
        .column("uai")
        .column("mefstat11")
        .column("rentreeScolaire")
        .doUpdateSet(constatRentree)
    )
    .execute();
};
