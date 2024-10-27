import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("campagne").addUniqueConstraint("annee_unique_constraint", ["annee"]).execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("campagne").dropConstraint("annee_unique_constraint").execute();
};
