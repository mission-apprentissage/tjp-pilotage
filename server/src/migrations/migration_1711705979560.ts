import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("demande")
    .addColumn("besoinRH", sql`varchar[]`)
    .addColumn("autreBesoinRH", "varchar")
    .addColumn("amiCmaValide", "boolean")
    .addColumn("amiCmaValideAnnee", "varchar(4)")
    .execute();

  // Refresh view to include new columns
  await db.schema.dropView("latestDemandeView").execute();
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

export const down = async (db: Kysely<unknown>) => {
  // Refresh view to include new columns
  await db.schema.dropView("latestDemandeView").execute();

  await db.schema
    .alterTable("demande")
    .dropColumn("amiCmaValideAnnee")
    .dropColumn("amiCmaValide")
    .dropColumn("autreBesoinRH")
    .dropColumn("besoinRH")
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
