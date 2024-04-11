import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("metier")
    .addColumn("codeMetier", "varchar(6)")
    .addPrimaryKeyConstraint("codeMetier_pkey", ["codeMetier"])
    .addColumn("codeRome", "varchar(5)")
    .addForeignKeyConstraint("fk_rome", ["codeRome"], "rome", ["codeRome"])
    .addColumn("libelleMetier", "varchar")
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("metier").execute();
};
