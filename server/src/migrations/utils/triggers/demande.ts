import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const enableDemandeMaterializedViewsRefreshTrigger = async () => {
  await getKbdClient().transaction().execute(async (transaction) => transaction.executeQuery(
    sql`
        CREATE OR REPLACE FUNCTION refresh_demande_views() RETURNS trigger AS $$
        BEGIN
          REFRESH MATERIALIZED VIEW CONCURRENTLY "latestDemandeView";
          REFRESH MATERIALIZED VIEW CONCURRENTLY "demandeConstatView";
          RETURN NULL;
        END;
        $$ LANGUAGE 'plpgsql' SECURITY DEFINER;

        CREATE OR REPLACE TRIGGER update_demande_materialized_views_t
        AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("demande")}
            FOR EACH ROW EXECUTE PROCEDURE refresh_demande_views();
      `.compile(getKbdClient())
  ));
};

export const disableDemandeMaterializedViewsRefreshTrigger = async () => {
  await getKbdClient().executeQuery(
    sql`
        DROP TRIGGER IF EXISTS update_demande_materialized_views_t ON ${sql.table("demande")} CASCADE;
        DROP FUNCTION IF EXISTS refresh_demande_views() CASCADE;
      `.compile(getKbdClient())
  );
};
