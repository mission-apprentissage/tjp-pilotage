import type {Kysely} from 'kysely';
import { sql} from 'kysely';

import {getKbdClient} from '@/db/db';

export const up = async (db: Kysely<unknown>) => {
  await db.schema.dropView("latestDemandeView").materialized().cascade().ifExists().execute();
  await db.schema.dropView("latestDemandeNonMaterializedView").cascade().ifExists().execute();

  await getKbdClient().executeQuery(
    sql`
      DROP INDEX IF EXISTS latestDemandeView_index;

      DROP TRIGGER IF EXISTS update_demande_refresh_materialized_view_t ON ${sql.table("demande")} CASCADE;

      DROP FUNCTION IF EXISTS refresh_latest_demande_view();
    `.compile(getKbdClient())
  );

  await db.schema
    .alterTable("demande")
    .renameColumn("libelleColoration", "libelleColoration1")
    .execute();

  await db.schema
    .alterTable("demande")
    .addColumn("libelleColoration2", "varchar")
    .execute();

  await db.schema
    .createView("latestDemandeView")
    .as(
      // @ts-ignore
      db
        .selectFrom((sq) =>
        // @ts-ignore
          sq
            .selectFrom("demande" as never)
          // @ts-ignore
            .select([sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemande")
        )
      // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemande.numero", "=", "demande.numero")
            .onRef("latestDemande.lastUpdatedAt", "=", "demande.updatedAt")
        )
      // @ts-ignore
        .selectAll("demande")
      // @ts-ignore
        .where("demande.statut", "!=", "supprimée")
    )
    .materialized()
    .execute();

  await db.schema
    .createView("latestDemandeNonMaterializedView")
    .as(
      // @ts-ignore
      db
        .selectFrom((sq) =>
        // @ts-ignore
          sq
            .selectFrom("demande" as never)
          // @ts-ignore
            .select([sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemande")
        )
      // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemande.numero", "=", "demande.numero")
            .onRef("latestDemande.lastUpdatedAt", "=", "demande.updatedAt")
        )
      // @ts-ignore
        .selectAll("demande")
      // @ts-ignore
        .where("demande.statut", "!=", "supprimée")
    )
    .execute();

  await db.schema
    .createIndex("latestDemandeView_index")
    .ifNotExists()
    .unique()
    .on("latestDemandeView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createdBy", "codeDispositif"])
    .execute();

  getKbdClient().transaction().execute(async (transaction) => transaction.executeQuery(
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

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropView("latestDemandeView").materialized().cascade().ifExists().execute();
  await db.schema.dropView("latestDemandeNonMaterializedView").cascade().ifExists().execute();

  await getKbdClient().executeQuery(
    sql`
      DROP INDEX IF EXISTS latestDemandeView_index;

      DROP TRIGGER IF EXISTS update_demande_refresh_materialized_view_t ON ${sql.table("demande")} CASCADE;

      DROP FUNCTION IF EXISTS refresh_latest_demande_view();
    `.compile(getKbdClient())
  );

  await db.schema
    .alterTable("demande")
    .dropColumn("libelleColoration2")
    .execute();

  await db.schema
    .alterTable("demande")
    .renameColumn("libelleColoration1", "libelleColoration")
    .execute();

  await db.schema
    .createView("latestDemandeView")
    .as(
      // @ts-ignore
      db
        .selectFrom((sq) =>
        // @ts-ignore
          sq
            .selectFrom("demande" as never)
          // @ts-ignore
            .select([sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemande")
        )
      // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemande.numero", "=", "demande.numero")
            .onRef("latestDemande.lastUpdatedAt", "=", "demande.updatedAt")
        )
      // @ts-ignore
        .selectAll("demande")
      // @ts-ignore
        .where("demande.statut", "!=", "supprimée")
    )
    .materialized()
    .execute();

  await db.schema
    .createView("latestDemandeNonMaterializedView")
    .as(
      // @ts-ignore
      db
        .selectFrom((sq) =>
        // @ts-ignore
          sq
            .selectFrom("demande" as never)
          // @ts-ignore
            .select([sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemande")
        )
      // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemande.numero", "=", "demande.numero")
            .onRef("latestDemande.lastUpdatedAt", "=", "demande.updatedAt")
        )
      // @ts-ignore
        .selectAll("demande")
      // @ts-ignore
        .where("demande.statut", "!=", "supprimée")
    )
    .execute();

  await db.schema
    .createIndex("latestDemandeView_index")
    .ifNotExists()
    .unique()
    .on("latestDemandeView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createdBy", "codeDispositif"])
    .execute();

  getKbdClient().transaction().execute(async (transaction) => transaction.executeQuery(
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
