import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const enableDemandeConstatViewRefreshTrigger = async () => {
  await getKbdClient().transaction().execute(async (transaction) => transaction.executeQuery(
    sql`
        CREATE OR REPLACE FUNCTION refresh_demande_constat_view() RETURNS trigger AS $$
        BEGIN
          REFRESH MATERIALIZED VIEW CONCURRENTLY "demandeConstatView";
          RETURN NULL;
        END;
        $$ LANGUAGE 'plpgsql' SECURITY DEFINER;

        CREATE OR REPLACE TRIGGER update_constat_refresh_materialized_view_t
        AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("demande")}
            FOR EACH ROW EXECUTE PROCEDURE refresh_demande_constat_view();
      `.compile(getKbdClient())
  ));
};

export const disableDemandeConstatViewRefreshTrigger = async () => {
  await getKbdClient().executeQuery(
    sql`
        DROP TRIGGER IF EXISTS update_constat_refresh_materialized_view_t ON ${sql.table("demande")} CASCADE;
        DROP FUNCTION IF EXISTS refresh_demande_constat_view() CASCADE;
      `.compile(getKbdClient())
  );
};
