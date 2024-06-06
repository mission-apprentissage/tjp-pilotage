import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.dropView("latestDemandeView").ifExists().execute();

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
            .select([
              sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"),
              "numero",
            ])
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
        .where("demande.statut", "!=", "deleted")
    )
    .materialized()
    .execute();

  await db.schema
    .createView("latestDemandeNonMaterializedView")
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
            .select([
              sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"),
              "numero",
            ])
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
        .where("demande.statut", "!=", "deleted")
    )
    .execute();

  await db.schema
    .createIndex("latestDemandeView_index")
    .unique()
    .on("latestDemandeView")
    .columns([
      "id",
      "numero",
      "campagneId",
      "cfd",
      "uai",
      "codeRegion",
      "codeAcademie",
      "createurId",
      "codeDispositif",
    ])
    .execute();

  await sql`
      CREATE FUNCTION refresh_latest_demande_view() RETURNS trigger AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY "latestDemandeView";
        RETURN NULL;
      END;
      $$ LANGUAGE 'plpgsql' SECURITY DEFINER;
  `.execute(db);

  await sql`
      CREATE TRIGGER update_demande_refresh_materialized_view_t
      AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("demande")}
          FOR EACH ROW EXECUTE PROCEDURE refresh_latest_demande_view();
      `.execute(db);
};

export const down = async (db: Kysely<unknown>) => {
  await sql`DROP TRIGGER IF EXISTS update_demande_refresh_materialized_view_t ON ${sql.table(
    "demande"
  )}`.execute(db);
  await sql`DROP FUNCTION IF EXISTS refresh_latest_demande_view()`.execute(db);

  await db.schema.dropIndex("latestDemandeView_index").ifExists().execute();

  await db.schema
    .dropView("latestDemandeView")
    .materialized()
    .ifExists()
    .execute();

  await db.schema
    .dropView("latestDemandeNonMaterializedView")
    .ifExists()
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
            .select([
              sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"),
              "numero",
            ])
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
        .where("demande.statut", "!=", "deleted")
    )
    .execute();
};
