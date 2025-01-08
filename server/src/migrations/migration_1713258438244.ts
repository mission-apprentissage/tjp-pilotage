import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.dropView("latestDemandeView").ifExists().execute();

  await db.schema.alterTable("demande").renameColumn("dateModification", "updatedAt").execute();

  await db.schema.alterTable("demande").renameColumn("dateCreation", "createdAt").execute();

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
            .as("latestDemandes"),
        )
        // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef("latestDemandes.lastUpdatedAt", "=", "demande.updatedAt"),
        )
        // @ts-ignore
        .selectAll("demande")
        // @ts-ignore
        .where("demande.statut", "!=", "deleted"),
    )
    .ifNotExists()
    .materialized()
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropView("latestDemandeView").materialized().execute();

  await db.schema.alterTable("demande").renameColumn("createdAt", "dateCreation").execute();

  await db.schema.alterTable("demande").renameColumn("updatedAt", "dateModification").execute();

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
            .select([sql<number>`max("demande"."dateModification")`.as("dateDerniereModification"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemandes"),
        )
        // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef("latestDemandes.dateDerniereModification", "=", "demande.dateModification"),
        )
        // @ts-ignore
        .selectAll("demande")
        // @ts-ignore
        .where("demande.statut", "!=", "deleted"),
    )
    .execute();
};
