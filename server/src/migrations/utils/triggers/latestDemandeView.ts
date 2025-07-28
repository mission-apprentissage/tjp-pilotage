import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const enableLatestDemandeViewRefreshTrigger = async () => {
  await getKbdClient().transaction().execute(async (transaction) => transaction.executeQuery(
    sql`
        CREATE OR REPLACE FUNCTION refresh_latest_demande_view() RETURNS trigger AS $$
        BEGIN
          REFRESH MATERIALIZED VIEW CONCURRENTLY "latestDemandeView";
          RETURN NULL;
        END;
        $$ LANGUAGE 'plpgsql' SECURITY DEFINER;

        CREATE OR REPLACE TRIGGER update_demande_refresh_materialized_view_t
        AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("demande")}
            FOR EACH ROW EXECUTE PROCEDURE refresh_latest_demande_view();
      `.compile(getKbdClient())
  ));
};

export const disableLatestDemandeViewRefreshTrigger = async () => {
  await getKbdClient().executeQuery(
    sql`
        DROP TRIGGER IF EXISTS update_demande_refresh_materialized_view_t ON ${sql.table("demande")} CASCADE;
        DROP FUNCTION IF EXISTS refresh_latest_demande_view() CASCADE;
      `.compile(getKbdClient())
  );
};
