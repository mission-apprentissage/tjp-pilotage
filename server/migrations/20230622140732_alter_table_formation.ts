import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  ALTER TABLE "formation"
    ADD COLUMN "CPC" varchar,
    ADD COLUMN "CPCSecteur" varchar,
    ADD COLUMN "CPCSousSecteur" varchar,
    ADD COLUMN "libelleFiliere" varchar;
  `.run(pool);
}

export async function down() {}
