import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  ALTER TABLE "formationEtablissement"
    ADD CONSTRAINT fk_etablissement_dispositif
      FOREIGN KEY("dispositifId")
      REFERENCES "dispositif"("codeDispositif");
  `.run(pool);
}

export async function down() {}
