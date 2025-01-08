import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const refreshDemandeIntentionMaterializedViews = async () => {
  await getKbdClient().executeQuery(
    sql`
    REFRESH MATERIALIZED VIEW "latestDemandeView" WITH DATA;
    REFRESH MATERIALIZED VIEW "latestIntentionView" WITH DATA;
    REFRESH MATERIALIZED VIEW "demandeIntentionView" WITH DATA;
    REFRESH MATERIALIZED VIEW "latestDemandeIntentionView" WITH DATA;
    `.compile(getKbdClient()),
  );
};
