import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "academie" (
    "codeAcademie" varchar(2) PRIMARY KEY,
    "libelle" varchar NOT NULL,
    "codeRegion" varchar(2) NOT NULL,
    CONSTRAINT fk_academie_region
        FOREIGN KEY("codeRegion")
        REFERENCES "region"("codeRegion")
  );
  `.run(pool);
}

export async function down() {}
