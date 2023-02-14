import { db, pool } from "../src/db/zapatos";

export async function up() {
  await db.sql`
    CREATE EXTENSION "uuid-ossp"
    SCHEMA "public"
    VERSION "1.1";
  `.run(pool);
}

export async function down() {}
