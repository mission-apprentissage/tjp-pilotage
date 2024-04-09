import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("domaineProfessionnel")
    .addColumn("codeDomaineProfessionnel", "varchar(3)")
    .addUniqueConstraint("codeDomaineProfessionnel", [
      "codeDomaineProfessionnel",
    ])
    .addColumn("libelleDomaineProfessionnel", "varchar")
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("domaineProfessionnel").execute();
};
