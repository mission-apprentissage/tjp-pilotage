import type {Kysely} from 'kysely';
import {sql} from 'kysely';

import {getKbdClient} from '@/db/db';

// **
// Migration dont l'objectif est de :
// - rassembler les demandes/intentions dans une seule table
// - de supprimer la notion d'intention
// - supprimer les vues d'agrégats demandeIntention / latestDemandeIntention etc...

export const up = async (db: Kysely<unknown>) => {
  await getKbdClient().executeQuery(
    sql`
        DROP INDEX IF EXISTS latestDemandeView_index;
        DROP TRIGGER IF EXISTS update_demande_refresh_materialized_view_t ON ${sql.table("demande")} CASCADE;
        DROP FUNCTION IF EXISTS refresh_latest_demande_view();
      `.compile(getKbdClient())
  );

  // regenerate views
  await db.schema.dropView("latestDemandeView").materialized().cascade().ifExists().execute();
  await db.schema.dropView("latestDemandeNonMaterializedView").cascade().ifExists().execute();

  await db.schema
    .alterTable("demande")
    .dropColumn("poursuitePedagogique")
    .dropColumn("compensationUai")
    .dropColumn("compensationCfd")
    .dropColumn("compensationCodeDispositif")
    .dropColumn("compensationRentreeScolaire")
    .execute();

  await db.schema
    .createView("latestDemandeView")
    .as(
    // ts-ignore is mandatory here because we refresh views in this migration
    // types are not yet infered from kysely codegen
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
            .as("latestDemandes")
        )
      // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef("latestDemandes.lastUpdatedAt", "=", "demande.updatedAt")
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
    .orReplace()
    .as(
    // ts-ignore is mandatory here because we refresh views in this migration
    // types are not yet infered from kysely codegen
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
            .as("latestDemandes")
        )
      // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef("latestDemandes.lastUpdatedAt", "=", "demande.updatedAt")
        )
      // @ts-ignore
        .selectAll("demande")
      // @ts-ignore
        .where("demande.statut", "!=", "supprimée")
    )
    .execute();

  await db.schema
    .createIndex("latestDemandeView_index")
    .unique()
    .on("latestDemandeView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createdBy", "codeDispositif"])
    .execute();

  await sql`
      CREATE OR REPLACE FUNCTION refresh_latest_demande_view() RETURNS trigger AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY "latestDemandeView";
        RETURN NULL;
      END;
      $$ LANGUAGE 'plpgsql' SECURITY DEFINER;

      CREATE OR REPLACE TRIGGER update_demande_refresh_materialized_view_t
      AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("demande")}
          FOR EACH ROW EXECUTE PROCEDURE refresh_latest_demande_view();
    `.execute(db);
};

export const down = async (db: Kysely<unknown>) => {
  await getKbdClient().executeQuery(
    sql`
      DROP INDEX IF EXISTS latestDemandeView_index;
      DROP TRIGGER IF EXISTS update_demande_refresh_materialized_view_t ON ${sql.table("demande")} CASCADE;
      DROP FUNCTION IF EXISTS refresh_latest_demande_view();
    `.compile(getKbdClient())
  );
  await db.schema.dropView("latestDemandeView").materialized().cascade().ifExists().execute();
  await db.schema.dropView("latestDemandeNonMaterializedView").cascade().ifExists().execute();

  await db.schema
    .alterTable("demande")
    .addColumn("poursuitePedagogique", "boolean")
    .addColumn("compensationUai", "varchar")
    .addColumn("compensationCfd", "varchar")
    .addColumn("compensationCodeDispositif", "varchar")
    .addColumn("compensationRentreeScolaire", "integer")
    .execute();

  await db.schema
    .createView("latestDemandeView")
    .as(
    // ts-ignore is mandatory here because we refresh views in this migration
    // types are not yet infered from kysely codegen
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
            .as("latestDemandes")
        )
      // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef("latestDemandes.lastUpdatedAt", "=", "demande.updatedAt")
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
    .orReplace()
    .as(
    // ts-ignore is mandatory here because we refresh views in this migration
    // types are not yet infered from kysely codegen
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
            .as("latestDemandes")
        )
      // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef("latestDemandes.lastUpdatedAt", "=", "demande.updatedAt")
        )
      // @ts-ignore
        .selectAll("demande")
      // @ts-ignore
        .where("demande.statut", "!=", "supprimée")
    )
    .execute();

  await db.schema
    .createIndex("latestDemandeView_index")
    .unique()
    .on("latestDemandeView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createdBy", "codeDispositif"])
    .execute();

  await sql`
    CREATE OR REPLACE FUNCTION refresh_latest_demande_view() RETURNS trigger AS $$
    BEGIN
      REFRESH MATERIALIZED VIEW CONCURRENTLY "latestDemandeView";
      RETURN NULL;
    END;
    $$ LANGUAGE 'plpgsql' SECURITY DEFINER;

    CREATE OR REPLACE TRIGGER update_demande_refresh_materialized_view_t
    AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("demande")}
        FOR EACH ROW EXECUTE PROCEDURE refresh_latest_demande_view();
    `.execute(db);
};
