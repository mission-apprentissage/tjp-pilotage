import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("rome")
    .addColumn("transitionEcologique", "boolean", (c) => c.notNull().defaultTo(false))
    .addColumn("transitionNumerique", "boolean", (c) => c.notNull().defaultTo(false))
    .addColumn("transitionDemographique", "boolean", (c) => c.notNull().defaultTo(false))
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("rome")
    .dropColumn("transitionEcologique")
    .dropColumn("transitionNumerique")
    .dropColumn("transitionDemographique")
    .execute();
};
