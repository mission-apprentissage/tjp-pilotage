import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";

export const createDataConstatsRentree = async (
  dataConstatsRentree: Insertable<DB["constatRentree"]>
) => {
  await kdb
    .insertInto("constatRentree")
    .values(dataConstatsRentree)
    .onConflict((oc) =>
      oc
        .column("uai")
        .column("mefstat11")
        .column("rentreeScolaire")
        .doUpdateSet(dataConstatsRentree)
    )
    .execute();
};
