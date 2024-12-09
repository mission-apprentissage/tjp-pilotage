import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("avis")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(db.fn("uuid_generate_v4")))
    .addColumn("userId", "uuid", (c) => c.references("user.id"))
    .addColumn("intentionNumero", "varchar", (c) => c.notNull())
    .addColumn("statutAvis", "varchar", (c) => c.notNull())
    .addColumn("typeAvis", "varchar", (c) => c.notNull())
    .addColumn("userFonction", "varchar")
    .addColumn("isVisibleParTous", "boolean", (c) => c.notNull())
    .addColumn("createdAt", "timestamptz", (c) => c.notNull().defaultTo(sql`NOW()`))
    .addColumn("updatedAt", "timestamptz", (c) => c.notNull())
    .addColumn("commentaire", "text")
    .execute();

  await db.schema
    .alterTable("avis")
    .addUniqueConstraint("avis_unique_constraint", ["userId", "intentionNumero", "typeAvis", "userFonction"])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("avis").cascade().execute();
};
