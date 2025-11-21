import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const refreshDemandeMaterializedView = async () =>
  getKbdClient()
    .executeQuery(
      sql`REFRESH MATERIALIZED VIEW "latestDemandeView" WITH DATA;`
        .compile(getKbdClient())
    );

