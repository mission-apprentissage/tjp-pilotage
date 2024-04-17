import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const insertCampagne = async ({
  data,
}: {
  data: Insertable<DB["campagne"]>;
}) => {
  await kdb
    .insertInto("campagne")
    .values(data)
    .onConflict((oc) => oc.column("annee").doNothing())
    .execute();
};
