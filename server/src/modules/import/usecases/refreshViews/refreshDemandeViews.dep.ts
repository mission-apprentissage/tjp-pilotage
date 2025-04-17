import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const refreshDemandeMaterializedView = () =>
  getKbdClient()
    .executeQuery(
      sql`REFRESH MATERIALIZED VIEW "latestDemandeView" WITH DATA;`
        .compile(getKbdClient())
    );

