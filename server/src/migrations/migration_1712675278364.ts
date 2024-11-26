import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("domaineProfessionnel")
    .addColumn("codeDomaineProfessionnel", "varchar(3)", (cb) => cb.notNull())
    .addUniqueConstraint("codeDomaineProfessionnel_unique", ["codeDomaineProfessionnel"])
    .addColumn("libelleDomaineProfessionnel", "varchar", (cb) => cb.notNull())
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("domaineProfessionnel").execute();
};
