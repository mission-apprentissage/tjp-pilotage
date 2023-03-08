import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "departement" (
    "codeDepartement" varchar(3) PRIMARY KEY,
    "libelle" varchar NOT NULL,
    "codeAcademie" varchar(2) NOT NULL,
    "codeRegion" varchar(2) NOT NULL,
    CONSTRAINT fk_departement_academie
        FOREIGN KEY("codeAcademie")
        REFERENCES "academie"("codeAcademie"),
    CONSTRAINT fk_departement_region
        FOREIGN KEY("codeRegion")
        REFERENCES "region"("codeRegion")
  );
  `.run(pool);
}

export async function down() {}
