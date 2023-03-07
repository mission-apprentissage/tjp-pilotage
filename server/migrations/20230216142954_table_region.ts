import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "region" (
    "codeRegion" varchar(2) PRIMARY KEY,
    "libelleRegion" varchar UNIQUE NOT NULL
  );
  `.run(pool);
}

export async function down() {}
