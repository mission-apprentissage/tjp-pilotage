import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("indicateurRegion").addColumn("tauxChomage", "float4").execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("indicateurRegion").dropColumn("tauxChomage").execute();
};
