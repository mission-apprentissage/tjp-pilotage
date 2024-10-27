import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("changementStatut")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(db.fn("uuid_generate_v4")))
    .addColumn("userId", "uuid", (c) => c.references("user.id"))
    .addColumn("intentionNumero", "varchar(8)", (c) => c.notNull())
    .addColumn("statutPrecedent", sql`"demandeStatut"`)
    .addColumn("statut", sql`"demandeStatut"`, (c) => c.notNull())
    .addColumn("createdAt", "timestamptz", (c) => c.notNull().defaultTo(sql`NOW()`))
    .addColumn("updatedAt", "timestamptz", (c) => c.notNull())
    .addColumn("commentaire", "text")
    .execute();

  await db.schema
    .alterTable("changementStatut")
    .addUniqueConstraint(
      "changementStatut_unique_constraint",
      ["userId", "intentionNumero", "statutPrecedent", "statut"],
      (builder) => builder.nullsNotDistinct()
    )

    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("changementStatut").cascade().execute();
};
