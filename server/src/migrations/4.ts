import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("indicateurRegion")
    .addColumn("codeRegion", "varchar(2)", (c) =>
      c.notNull().references("region.codeRegion")
    )
    .addColumn("rentreeScolaire", "varchar(4)", (c) => c.notNull())
    .addColumn("nbDecrocheurs", "integer")
    .addColumn("effectifDecrochage", "integer")
    .addUniqueConstraint("indicateurRegion_unique_constraint", [
      "codeRegion",
      "rentreeScolaire",
    ])
    .execute();
};
export const down = async () => {};
