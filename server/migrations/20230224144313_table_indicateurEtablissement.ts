import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "indicateurEtablissement" (
    "UAI" varchar(8) NOT NULL,
    "millesime" varchar(9) NOT NULL,
    "valeurAjoutee" int,
    CONSTRAINT fk_etablissement
      FOREIGN KEY("UAI")
      REFERENCES etablissement("UAI"),
    CONSTRAINT indicateurEtablissement_pk
      PRIMARY KEY ("UAI", "millesime")
  );
  `.run(pool);
}

export async function down() {}
