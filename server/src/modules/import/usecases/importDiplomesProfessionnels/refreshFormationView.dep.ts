import { sql } from "kysely";

import { kdb } from "../../../../db/db";

export const refreshFormationMaterializedView = async () => {
  await kdb.executeQuery(
    sql`
      REFRESH MATERIALIZED VIEW "formationView" WITH DATA;
    `.compile(kdb)
  );
};
