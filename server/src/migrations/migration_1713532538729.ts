import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.dropView("latestIntentionView").ifExists().execute();

  await db.schema
    .createView("latestIntentionView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom((sq) =>
          // @ts-ignore
          sq
            .selectFrom("intention" as never)
            // @ts-ignore
            .select([sql<number>`max("intention"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestIntention"),
        )
        // @ts-ignore
        .leftJoin("intention", (join) =>
          join
            .onRef("latestIntention.numero", "=", "intention.numero")
            .onRef("latestIntention.lastUpdatedAt", "=", "intention.updatedAt"),
        )
        // @ts-ignore
        .selectAll("intention")
        // @ts-ignore
        .where("intention.statut", "!=", "deleted"),
    )
    .materialized()
    .execute();

  await db.schema
    .createView("latestIntentionNonMaterializedView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom((sq) =>
          // @ts-ignore
          sq
            .selectFrom("intention" as never)
            // @ts-ignore
            .select([sql<number>`max("intention"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestIntention"),
        )
        // @ts-ignore
        .leftJoin("intention", (join) =>
          join
            .onRef("latestIntention.numero", "=", "intention.numero")
            .onRef("latestIntention.lastUpdatedAt", "=", "intention.updatedAt"),
        )
        // @ts-ignore
        .selectAll("intention")
        // @ts-ignore
        .where("intention.statut", "!=", "deleted"),
    )
    .execute();

  await db.schema
    .createIndex("latestIntentionView_index")
    .unique()
    .on("latestIntentionView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createurId", "codeDispositif"])
    .execute();

  await sql`
      CREATE FUNCTION refresh_latest_intention_view() RETURNS trigger AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY "latestIntentionView";
        RETURN NULL;
      END;
      $$ LANGUAGE 'plpgsql' SECURITY DEFINER;
  `.execute(db);

  await sql`
      CREATE TRIGGER update_intention_refresh_materialized_view_t
      AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("intention")}
          FOR EACH ROW EXECUTE PROCEDURE refresh_latest_intention_view();
      `.execute(db);
};

export const down = async (db: Kysely<unknown>) => {
  await sql`DROP TRIGGER update_intention_refresh_materialized_view_t ON ${sql.table("intention")}`.execute(db);
  await sql`DROP FUNCTION refresh_latest_intention_view()`.execute(db);

  await db.schema.dropIndex("latestIntentionView_index").ifExists().execute();

  await db.schema.dropView("latestIntentionView").materialized().ifExists().execute();

  await db.schema.dropView("latestIntentionNonMaterializedView").ifExists().execute();

  await db.schema
    .createView("latestIntentionView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom((sq) =>
          // @ts-ignore
          sq
            .selectFrom("intention" as never)
            // @ts-ignore
            .select([sql<number>`max("intention"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestIntention"),
        )
        // @ts-ignore
        .leftJoin("intention", (join) =>
          join
            .onRef("latestIntention.numero", "=", "intention.numero")
            .onRef("latestIntention.lastUpdatedAt", "=", "intention.updatedAt"),
        )
        // @ts-ignore
        .selectAll("intention")
        // @ts-ignore
        .where("intention.statut", "!=", "deleted"),
    )
    .execute();
};
