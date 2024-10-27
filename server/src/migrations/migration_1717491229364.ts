import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("suivi")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(db.fn("uuid_generate_v4")))
    .addColumn("intentionNumero", "varchar(8)", (c) => c.notNull())
    .addColumn("userId", "uuid", (c) => c.references("user.id").notNull())
    .addColumn("createdAt", "timestamptz", (c) => c.notNull().defaultTo(sql`NOW()`))
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("suivi").cascade().execute();
};
