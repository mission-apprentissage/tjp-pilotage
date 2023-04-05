import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  ALTER TABLE "formation"
    ALTER COLUMN rncp DROP NOT NULL;
  `.run(pool);
}

export async function down() {}
