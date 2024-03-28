import { Insertable } from "kysely";

import { DB, kdb } from "../../../../../db/db";

export const getSimilarCampagne = async ({
  data,
}: {
  data: Insertable<DB["campagne"]>;
}) =>
  await kdb
    .selectFrom("campagne")
    .selectAll()
    .where("campagne.annee", "=", data.annee)
    .executeTakeFirst();
