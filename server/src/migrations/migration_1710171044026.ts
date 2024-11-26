import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("user").addColumn("lastSeenAt", "timestamp").execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("user").dropColumn("lastSeenAt").execute();
};
