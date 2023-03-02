import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "etablissement" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "UAI" varchar(8) UNIQUE NOT NULL,
    "siret" varchar(14),
    "codeAcademie" varchar(2),
    "natureUAI" varchar(3),
    "libelleEtablissement" varchar(200),
    "adresseEtablissement" varchar(200),
    "codePostal" varchar(5),
    "secteur" varchar(2),
    "dateOuverture" Date,
    "dateFermeture" Date,
    "codeMinistereTutuelle" varchar(2)
  );
  `.run(pool);
}

export async function down() {}
