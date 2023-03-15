import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "dispositif" (
    "codeDispositif" varchar(3) PRIMARY KEY,
    "codeNiveauDiplome" varchar(3) NOT NULL,
    "libelleDispositif" varchar(300) NOT NULL,
    CONSTRAINT fk_dispositif_niveauDiplome
        FOREIGN KEY("codeNiveauDiplome")
        REFERENCES "niveauDiplome"("codeNiveauDiplome")
  );
  `.run(pool);
}

export async function down() {}
