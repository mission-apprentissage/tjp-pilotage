import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.executeQuery(sql`TRUNCATE TABLE "discipline" CASCADE;`.compile(db));

  await db.schema.alterTable("discipline").dropColumn("dateOuverture").dropColumn("dateFermeture").execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("discipline")
    .addColumn("dateOuverture", "date")
    .addColumn("dateFermeture", "date")
    .execute();
};
