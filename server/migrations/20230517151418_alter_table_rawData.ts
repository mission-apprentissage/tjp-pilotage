import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
  ALTER TABLE "rawData"
    ADD COLUMN "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4();
  CREATE EXTENSION pg_trgm;
  CREATE EXTENSION btree_gin;
  CREATE INDEX "rawData_gin_data__type_id" 
      ON "rawData" USING GIN("type", data, id);
  `.run(pool);
}

export async function down() {}
