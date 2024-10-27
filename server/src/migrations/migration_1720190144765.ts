import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("maintenance")
    .addColumn("isMaintenance", "boolean", (c) => c.notNull().defaultTo(false))
    .execute();

  await db.schema.alterTable("maintenance").addPrimaryKeyConstraint("maintenance_pkey", ["isMaintenance"]).execute();

  await db.schema
    .alterTable("maintenance")
    .addUniqueConstraint("maintenance_unique_constraint", ["isMaintenance"])
    .execute();

  // Ne passe pas via le insertInto de kysely
  await db.executeQuery(
    sql`
    INSERT INTO "maintenance" ("isMaintenance") VALUES ('false');
  `.compile(db)
  );
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("maintenance").execute();
};
