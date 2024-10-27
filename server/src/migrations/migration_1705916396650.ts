/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .alterTable("user")
    .addColumn("enabled", "boolean", (c) => c.notNull().defaultTo(true))
    .addColumn("sub", "text")
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.alterTable("user").dropColumn("enabled").dropColumn("sub").execute();
};
