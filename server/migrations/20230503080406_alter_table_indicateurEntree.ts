import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  ALTER TABLE "indicateurEntree"
    ADD COLUMN "premiersVoeux" jsonb
  `.run(pool);
}

export async function down() {}
