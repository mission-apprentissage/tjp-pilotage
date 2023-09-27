import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("demande")
    .alterColumn("uai", (c) => c.setNotNull())
    .alterColumn("codeRegion", (c) => c.setNotNull())
    .addColumn("updatedAt", "timestamptz", (c) => c.notNull())
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("demande")
    .alterColumn("uai", (c) => c.dropNotNull())
    .alterColumn("codeRegion", (c) => c.dropNotNull())
    .dropColumn("updatedAt")
    .execute();
};
