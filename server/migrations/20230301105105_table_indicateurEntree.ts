import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "indicateurEntree" (
    "formationEtablissementId" uuid NOT NULL,
    "millesimeEntree" varchar(4) NOT NULL,
    "capacite" int,
    "effectifEntree" int,
    "nbPremiersVoeux" int,
    CONSTRAINT fk_indicateurEntree_formationEtablissement
      FOREIGN KEY("formationEtablissementId")
	  REFERENCES "formationEtablissement"("id"),
    CONSTRAINT indicateurEntree_pk
      PRIMARY KEY ("formationEtablissementId", "millesimeEntree")
  );
  `.run(pool);
}

export async function down() {}
