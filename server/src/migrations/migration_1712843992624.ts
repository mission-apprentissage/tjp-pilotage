import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("metier")
    .addColumn("codeMetier", "varchar(6)", (cb) => cb.notNull())
    .addPrimaryKeyConstraint("codeMetier_pk", ["codeMetier"])
    .addColumn("codeRome", "varchar(5)", (cb) => cb.notNull())
    .addForeignKeyConstraint("rome_fk", ["codeRome"], "rome", ["codeRome"])
    .addColumn("libelleMetier", "varchar", (cb) => cb.notNull())
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("metier").execute();
};
