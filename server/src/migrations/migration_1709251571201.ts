import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.executeQuery(sql`TRUNCATE TABLE "diplomeProfessionnel" CASCADE;`.compile(db));
};

export const down = async (_db: Kysely<unknown>) => {
  // No down migration
};
