import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "formationEtablissement" (
    "cfd" varchar(8) NOT NULL,
    "UAI" varchar(8) NOT NULL,
    "dispositifId" varchar(3) NOT NULL,
    "voie" varchar(20) NOT NULL,
    "millesimeEntree" varchar(4) NOT NULL,
    "millesimeIJ" varchar(9) NOT NULL,
    "capacite" int,
    "effectifEntree" int,
    "nbPremiersVoeux" int,
    "reussite" int,
    "effectifSortie" int,
    "nbSortants" int,
    "nbPoursuiteEtudes" int,
    "nbInsertion6mois" int,
    CONSTRAINT fk_formation
      FOREIGN KEY("cfd")
	  REFERENCES formation("codeFormationDiplome"),
    CONSTRAINT fk_etablissement
      FOREIGN KEY("UAI")
      REFERENCES etablissement("UAI"),
    CONSTRAINT formationEtablissement_pk
      PRIMARY KEY ("cfd", "UAI", "dispositifId", "millesimeIJ", "voie")
  );
  `.run(pool);
}

export async function down() {}
