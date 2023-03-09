import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  ALTER TABLE formation
    ADD CONSTRAINT fk_formation_niveauDiplome
      FOREIGN KEY("codeNiveauDiplome")
      REFERENCES "niveauDiplome"("codeNiveauDiplome");
  `.run(pool);
}

export async function down() {}
