import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  ALTER TABLE "indicateurEntree"
    ADD COLUMN "effectifs" jsonb,
    ADD COLUMN "capacites" jsonb,
    ADD COLUMN "anneeDebut" int,
    RENAME COLUMN "millesimeEntree" TO "rentreeScolaire"
  `.run(pool);
}

export async function down() {}
