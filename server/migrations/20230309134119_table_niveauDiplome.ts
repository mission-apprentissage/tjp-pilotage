import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "niveauDiplome" (
    "codeNiveauDiplome" varchar(3) PRIMARY KEY,
    "libelleNiveauDiplome" varchar(300)
  );
  ALTER TABLE formation
    ADD CONSTRAINT fk_formation_niveauDiplome
        FOREIGN KEY("codeNiveauDiplome")
        REFERENCES "niveauDiplome"("codeNiveauDiplome");
  `.run(pool);
}

export async function down() {}
