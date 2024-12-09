import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("discipline")
    .addColumn("codeDiscipline", "varchar")
    .addColumn("libelleDiscipline", "varchar")
    .addColumn("dateOuverture", "date")
    .addColumn("dateFermeture", "date")
    .execute();

  await db.schema.alterTable("discipline").addPrimaryKeyConstraint("discipline_pkey", ["codeDiscipline"]).execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("discipline").execute();
};
