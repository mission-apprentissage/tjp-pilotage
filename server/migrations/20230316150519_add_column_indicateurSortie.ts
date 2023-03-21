import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  ALTER TABLE "indicateurSortie" 
    ADD COLUMN "nbInsertion12mois" int,
    ADD COLUMN "nbInsertion24mois" int;
  `.run(pool);
}

export async function down() {}
