import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("metier")
    .addColumn("codeMetier", "varchar(6)", (cb) => cb.notNull())
    .addPrimaryKeyConstraint("codeMetier_pkey", ["codeMetier"])
    .addColumn("codeRome", "varchar(5)", (cb) => cb.notNull())
    .addForeignKeyConstraint("fk_rome", ["codeRome"], "rome", ["codeRome"])
    .addColumn("libelleMetier", "varchar", (cb) => cb.notNull())
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("metier").execute();
};
