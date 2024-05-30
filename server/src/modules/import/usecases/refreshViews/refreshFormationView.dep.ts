import { sql } from "kysely";

import { kdb } from "../../../../db/db";

export const refreshFormationMaterializedViews = async () => {
  await kdb.executeQuery(
    sql`
    REFRESH MATERIALIZED VIEW "formationView" WITH DATA;
    REFRESH MATERIALIZED VIEW "formationScolaireView" WITH DATA;
    REFRESH MATERIALIZED VIEW "formationApprentissageView" WITH DATA;
    `.compile(kdb)
  );
};
