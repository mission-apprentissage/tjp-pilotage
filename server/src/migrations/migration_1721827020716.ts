import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
        BEGIN;

        -- Disable specific triggers on the demande table
        ALTER TABLE demande DISABLE TRIGGER update_demande_refresh_demande_intention_materialized_view_t;
        ALTER TABLE demande DISABLE TRIGGER update_demande_refresh_latest_demande_intention_materialized_vi;
        ALTER TABLE demande DISABLE TRIGGER update_demande_refresh_materialized_view_t;
        ALTER TABLE demande DISABLE TRIGGER t;

        -- Disable specific triggers on the intention table
        ALTER TABLE intention DISABLE TRIGGER update_intention_refresh_demande_intention_materialized_view_t;
        ALTER TABLE intention DISABLE TRIGGER update_intention_refresh_latest_demande_intention_materialized_;
        ALTER TABLE intention DISABLE TRIGGER update_intention_refresh_materialized_view_t;

        -- First update statement
        UPDATE demande
        SET "capaciteScolaire" = "capaciteScolaireActuelle",
            "capaciteApprentissage" = "capaciteApprentissageActuelle"
        WHERE "typeDemande" = 'coloration';

        -- Second update statement
        UPDATE intention
        SET "capaciteScolaire" = "capaciteScolaireActuelle",
            "capaciteApprentissage" = "capaciteApprentissageActuelle"
        WHERE "typeDemande" = 'coloration';

        -- Re-enable specific triggers on the demande table
        ALTER TABLE demande ENABLE TRIGGER update_demande_refresh_demande_intention_materialized_view_t;
        ALTER TABLE demande ENABLE TRIGGER update_demande_refresh_latest_demande_intention_materialized_vi;
        ALTER TABLE demande ENABLE TRIGGER update_demande_refresh_materialized_view_t;
        ALTER TABLE demande ENABLE TRIGGER t;

        -- Re-enable specific triggers on the intention table
        ALTER TABLE intention ENABLE TRIGGER update_intention_refresh_demande_intention_materialized_view_t;
        ALTER TABLE intention ENABLE TRIGGER update_intention_refresh_latest_demande_intention_materialized_;
        ALTER TABLE intention ENABLE TRIGGER update_intention_refresh_materialized_view_t;

        COMMIT;
  `.compile(db),
  );
};

export const down = async () => {};
