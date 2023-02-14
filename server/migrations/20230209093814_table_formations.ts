import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "formations" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "codeFormationDiplome" varchar(8) UNIQUE NOT NULL,
    "rncp" int NOT NULL,
    "libelleDiplome" varchar NOT NULL,
    "codeNiveauDiplome" varchar(3) NOT NULL,
    "dateOuverture" date NOT NULL,
    "dateFermeture" date
  );
  `.run(pool);
}

export async function down() {}
