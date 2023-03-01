import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "formationEtablissement" (
    "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    "cfd" varchar(8) NOT NULL,
    "UAI" varchar(8) NOT NULL,
    "dispositifId" varchar(3) NOT NULL,
    "voie" varchar(20) NOT NULL,
    CONSTRAINT fk_formation
      FOREIGN KEY("cfd")
	    REFERENCES formation("codeFormationDiplome"),
    CONSTRAINT fk_etablissement
      FOREIGN KEY("UAI")
      REFERENCES etablissement("UAI"),
    CONSTRAINT formationEtablissement_pk
      UNIQUE ("cfd", "UAI", "dispositifId", "voie")
  );
  `.run(pool);
}

export async function down() {}
