import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "formationHistorique" (
    "codeFormationDiplome" varchar(8) NOT NULL,
    "ancienCFD" varchar(8) NOT NULL,
    CONSTRAINT fk_formation
      FOREIGN KEY("codeFormationDiplome") 
	    REFERENCES formation("codeFormationDiplome"),
    CONSTRAINT fk_formation2
      FOREIGN KEY("ancienCFD") 
	    REFERENCES formation("codeFormationDiplome"),
    CONSTRAINT formationhistorique_pk
      PRIMARY KEY (codeFormationDiplome, ancienCFD)
  );
  `.run(pool);
}

export async function down() {}
