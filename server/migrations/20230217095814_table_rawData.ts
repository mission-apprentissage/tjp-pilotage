import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "rawData" (
    "type" varchar NOT NULL,
    "key" varchar NOT NULL,
    "data" jsonb,
    UNIQUE(type, key)
  );
  `.run(pool);
}

export async function down() {}
