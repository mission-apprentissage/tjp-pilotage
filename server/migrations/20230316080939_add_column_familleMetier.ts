import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  ALTER TABLE "familleMetier" 
    ADD COLUMN "cfdSpecialite" varchar(8) NOT NULL;
  `.run(pool);
}

export async function down() {}
