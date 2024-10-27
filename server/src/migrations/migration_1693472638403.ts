/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable("user")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn("email", "varchar", (c) => c.notNull().unique())
    .addColumn("firstname", "varchar")
    .addColumn("lastname", "varchar")
    .addColumn("password", "varchar")
    .addColumn("createdAt", "timestamptz", (c) => c.defaultTo(sql`NOW()`))
    .addColumn("role", "varchar(30)")
    .execute();
};
export const down = async () => {};
