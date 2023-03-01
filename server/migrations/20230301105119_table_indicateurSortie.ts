import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "indicateurSortie" (
    "formationEtablissementId" uuid NOT NULL,
    "millesimeSortie" varchar(9) NOT NULL,
    "reussite" int,
    "effectifSortie" int,
    "nbSortants" int,
    "nbPoursuiteEtudes" int,
    "nbInsertion6mois" int,
    CONSTRAINT fk_indicateurSortie_formationEtablissement
      FOREIGN KEY("formationEtablissementId")
	  REFERENCES "formationEtablissement"("id"),
    CONSTRAINT indicateurSortie_pk
      PRIMARY KEY ("formationEtablissementId", "millesimeSortie")
  );
  `.run(pool);
}

export async function down() {}
