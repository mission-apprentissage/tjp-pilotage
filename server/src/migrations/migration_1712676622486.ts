import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("rome")
    .addColumn("codeRome", "varchar(5)", (cb) => cb.notNull())
    .addPrimaryKeyConstraint("codeRome_pk", ["codeRome"])
    .addColumn("libelleRome", "varchar", (cb) => cb.notNull())
    .addColumn("codeDomaineProfessionnel", "varchar(3)", (cb) => cb.notNull())
    .addForeignKeyConstraint("codeDomaineProfessionnel_fk", ["codeDomaineProfessionnel"], "domaineProfessionnel", [
      "codeDomaineProfessionnel",
    ])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("rome").execute();
};
