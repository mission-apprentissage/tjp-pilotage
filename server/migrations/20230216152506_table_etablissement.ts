import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "etablissement" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "UAI" varchar(8) UNIQUE NOT NULL,
    "siret" varchar(14),
    "codeAcademie" varchar(2) NOT NULL,
    "natureUAI" varchar(3) NOT NULL,
    "libelleEtablissement" varchar(200) NOT NULL,
    "adresseEtablissement" varchar(200),
    "codePostal" varchar(5) NOT NULL,
    "secteur" varchar(2) NOT NULL,
    "dateOuverture" Date NOT NULL,
    "dateFermeture" Date,
    "codeMinistereTutuelle" varchar(2) NOT NULL
  );
  `.run(pool);
}

export async function down() {}
