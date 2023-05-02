import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  ALTER TABLE "indicateurEntree" RENAME COLUMN "millesimeEntree" TO "rentreeScolaire";
  ALTER TABLE "indicateurEntree"
    ADD COLUMN "effectifs" jsonb,
    ADD COLUMN "capacites" jsonb,
    ADD COLUMN "anneeDebut" int;
  `.run(pool);
}

export async function down() {}
