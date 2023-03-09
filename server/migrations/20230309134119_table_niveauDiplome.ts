import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "niveauDiplome" (
    "codeNiveauDiplome" varchar(3) PRIMARY KEY,
    "libelleNiveauDiplome" varchar(300)
  );
  `.run(pool);
}

export async function down() {}
