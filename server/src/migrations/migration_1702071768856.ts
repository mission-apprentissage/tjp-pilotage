import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<never>) => {
  await db.schema
    .alterTable("user")
    .addColumn("uais", sql`varchar(8)[]`)
    .execute();
};

export const down = async (db: Kysely<never>) => {
  await db.schema.alterTable("user").dropColumn("uais").execute();
};
