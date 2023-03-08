import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  ALTER TABLE etablissement 
    ADD COLUMN "codeRegion" varchar(2),
    ADD COLUMN "codeDepartement" varchar(3),
    ADD CONSTRAINT fk_etablissement_region
        FOREIGN KEY("codeRegion")
        REFERENCES "region"("codeRegion"),
    ADD CONSTRAINT fk_etablissement_departement
        FOREIGN KEY("codeDepartement")
        REFERENCES "departement"("codeDepartement"),
    ADD CONSTRAINT fk_etablissement_academie
        FOREIGN KEY("codeAcademie")
        REFERENCES "academie"("codeAcademie");
  `.run(pool);
}

export async function down() {}
