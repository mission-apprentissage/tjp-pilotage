import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "familleMetier" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "libelleOfficielFamille" varchar NOT NULL,
    "libelleOfficielSpecialite" varchar NOT NULL,
    "codeMinistereTutelle" varchar(2) NOT NULL,
    "mefStat11Famille" varchar NOT NULL,
    "mefStat11Specialite" varchar NOT NULL UNIQUE
  );
  `.run(pool);
}

export async function down() {}
