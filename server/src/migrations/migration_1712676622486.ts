import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("rome")
    .addColumn("codeRome", "varchar(5)", (cb) => cb.notNull())
    .addPrimaryKeyConstraint("codeRome_pkey", ["codeRome"])
    .addColumn("libelleRome", "varchar", (cb) => cb.notNull())
    .addColumn("codeDomaineProfessionnel", "varchar(3)", (cb) => cb.notNull())
    .addForeignKeyConstraint(
      "fk_codeDomaineProfessionnel",
      ["codeDomaineProfessionnel"],
      "domaineProfessionnel",
      ["codeDomaineProfessionnel"]
    )
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("rome").execute();
};
