import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";

export const createDataEtablissement = async ({
  data
}: {
  data: Array<Insertable<DB["dataEtablissement"]>>
}) => {
  await kdb
    .insertInto("dataEtablissement")
    .values(data)
    .execute();
};
