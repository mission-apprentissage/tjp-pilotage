import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("actionPrioritaire")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(sql`uuid_generate_v4()`))
    .addColumn("cfd", "varchar(8)", (c) => c.references("dataFormation.cfd").onDelete("cascade").notNull())
    .addColumn("codeRegion", "varchar(2)", (c) => c.references("region.codeRegion").onDelete("cascade").notNull())
    .addColumn("codeDispositif", "varchar(3)", (c) =>
      c.references("dispositif.codeDispositif").onDelete("cascade").notNull(),
    )
    .execute();

  await db.schema
    .alterTable("actionPrioritaire")
    .addUniqueConstraint("actionPrioritaire_unique_constraint", ["cfd", "codeRegion", "codeDispositif"])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("actionPrioritaire").execute();
};
