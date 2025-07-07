import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const enableLatestDemandeViewRefreshTrigger = async () => {
  await getKbdClient().transaction().execute(async (transaction) => transaction.executeQuery(
    sql`
        CREATE OR REPLACE FUNCTION update_demande_refresh_materialized_view_t() RETURNS trigger AS $$
        BEGIN
          REFRESH MATERIALIZED VIEW CONCURRENTLY "latestDemandeView";
          RETURN NULL;
        END;
        $$ LANGUAGE 'plpgsql' SECURITY DEFINER;

        CREATE OR REPLACE TRIGGER refresh_latest_demande_view
        AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("demande")}
            FOR EACH ROW EXECUTE PROCEDURE update_demande_refresh_materialized_view_t();
      `.compile(getKbdClient())
  ));
};

export const disableLatestDemandeViewRefreshTrigger = async () => {
  await getKbdClient().executeQuery(
    sql`
        DROP TRIGGER IF EXISTS refresh_latest_demande_view ON ${sql.table("demande")} CASCADE;
        DROP FUNCTION IF EXISTS update_demande_refresh_materialized_view_t() CASCADE;
      `.compile(getKbdClient())
  );
};
