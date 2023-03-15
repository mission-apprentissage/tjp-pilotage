import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  ALTER TABLE etablissement 
    ADD COLUMN "commune" varchar;
  `.run(pool);
}

export async function down() {}
