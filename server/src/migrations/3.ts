import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("user")
    .addColumn("id", "uuid", (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v4()`)
    )
    .addColumn("email", "varchar", (c) => c.notNull().unique())
    .addColumn("password", "varchar")
    .addColumn("createdAt", "timestamptz", (c) => c.defaultTo(sql`NOW()`))
    .execute();
};
export const down = async () => {};
