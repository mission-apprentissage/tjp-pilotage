import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("rome")
    .addColumn("codeRome", "varchar(5)")
    .addPrimaryKeyConstraint("codeRome_pkey", ["codeRome"])
    .addColumn("libelleRome", "varchar")
    .addColumn("codeDomaineProfessionnel", "varchar(3)")
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
