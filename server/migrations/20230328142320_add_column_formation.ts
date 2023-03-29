import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  ALTER TABLE "formation" 
    ADD COLUMN "officielle" boolean NOT NULL DEFAULT false;
  `.run(pool);
}

export async function down() {}
