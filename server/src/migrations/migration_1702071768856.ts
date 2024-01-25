/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .alterTable("user")
    .addColumn("uais", sql`varchar(8)[]`)
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.alterTable("user").dropColumn("uais").execute();
};
