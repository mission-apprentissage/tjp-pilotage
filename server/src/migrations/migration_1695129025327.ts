/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema.alterTable("user").addColumn("codeRegion", "varchar(2)").execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.alterTable("user").dropColumn("codeRegion").execute();
};
