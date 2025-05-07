import type {Kysely} from 'kysely';
import { sql} from 'kysely';
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";

import { getKbdClient } from "@/db/db";

export const up = async (db: Kysely<unknown>) => {

  // disable les triggers qui utilisent trop de mémoire sur des opérations massives
  await getKbdClient().executeQuery(
    sql`
      -- Disable specific triggers on the demande table
      ALTER TABLE demande DISABLE TRIGGER update_demande_refresh_demande_intention_materialized_view_t;
      ALTER TABLE demande DISABLE TRIGGER update_demande_refresh_latest_demande_intention_materialized_vi;
      ALTER TABLE demande DISABLE TRIGGER update_demande_refresh_materialized_view_t;

      -- Disable specific triggers on the intention table
      ALTER TABLE intention DISABLE TRIGGER update_intention_refresh_demande_intention_materialized_view_t;
      ALTER TABLE intention DISABLE TRIGGER update_intention_refresh_latest_demande_intention_materialized_;
      ALTER TABLE intention DISABLE TRIGGER update_intention_refresh_materialized_view_t;
    `.compile(db)
  );

  await getKbdClient()
    .updateTable("demande")
    .set(
      {
        statut: DemandeStatutEnum["demande validée"]
      }
    )
    .where("demande.typeDemande", "=", DemandeTypeEnum["ajustement"])
    .where("demande.statut", "=", DemandeStatutEnum["projet de demande"])
    .where("demande.id", "in", (eb) => eb.selectFrom("latestDemandeView").select("id"))
    .execute();

  await getKbdClient()
    // @ts-ignore
    .updateTable("intention")
    .set(
      {
        statut: DemandeStatutEnum["demande validée"]
      }
    )
    .where("typeDemande", "=", DemandeTypeEnum["ajustement"])
    .where("statut", "=", DemandeStatutEnum["projet de demande"])
    // @ts-ignore
    .where("id", "in", (eb) => eb.selectFrom("latestIntentionView").select("id"))
    .execute();


  // enable les triggers
  await getKbdClient().executeQuery(
    sql`
      -- Re-enable specific triggers on the demande table
      ALTER TABLE demande ENABLE TRIGGER update_demande_refresh_demande_intention_materialized_view_t;
      ALTER TABLE demande ENABLE TRIGGER update_demande_refresh_latest_demande_intention_materialized_vi;
      ALTER TABLE demande ENABLE TRIGGER update_demande_refresh_materialized_view_t;

      -- Re-enable specific triggers on the intention table
      ALTER TABLE intention ENABLE TRIGGER update_intention_refresh_demande_intention_materialized_view_t;
      ALTER TABLE intention ENABLE TRIGGER update_intention_refresh_latest_demande_intention_materialized_;
      ALTER TABLE intention ENABLE TRIGGER update_intention_refresh_materialized_view_t;
    `.compile(db)
  );

  await getKbdClient().executeQuery(
    sql`
    REFRESH MATERIALIZED VIEW "latestDemandeView" WITH DATA;
    REFRESH MATERIALIZED VIEW "latestIntentionView" WITH DATA;
    REFRESH MATERIALIZED VIEW "demandeIntentionView" WITH DATA;
    REFRESH MATERIALIZED VIEW "latestDemandeIntentionView" WITH DATA;
    `.compile(db)
  );
};

export const down = async (_db: Kysely<unknown>) => {};
