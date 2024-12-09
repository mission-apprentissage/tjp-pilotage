import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("intention").dropConstraint("intention_unique_constraint").ifExists().execute();
};

export const down = async (_db: Kysely<unknown>) => {};
