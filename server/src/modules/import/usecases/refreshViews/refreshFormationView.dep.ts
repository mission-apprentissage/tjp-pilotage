import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const refreshFormationMaterializedViews = async () => {
  await getKbdClient().executeQuery(
    sql`
    REFRESH MATERIALIZED VIEW "formationView" WITH DATA;
    REFRESH MATERIALIZED VIEW "formationScolaireView" WITH DATA;
    REFRESH MATERIALIZED VIEW "formationApprentissageView" WITH DATA;
    `.compile(getKbdClient()),
  );
};
