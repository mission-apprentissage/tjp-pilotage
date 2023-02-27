import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  CREATE TABLE "rawData" (
    "type" varchar NOT NULL,
    "data" jsonb,
    INDEX "rawData_daftar_data" 
      ON "rawData" USING GIN(data)
  );
  `.run(pool);
}

export async function down() {}
