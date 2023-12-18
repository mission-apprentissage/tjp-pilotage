import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("constatRentree")
    .addColumn("rentreeScolaire", "varchar")
    .addColumn("mefstat11", "varchar")
    .addColumn("uai", "varchar")
    .addColumn("effectifs", "jsonb")
    .addColumn("anneeDispositif", "integer")
    .addColumn("cfd", "varchar")
    .addUniqueConstraint("constatRentree_unique_constraint", [
      "rentreeScolaire",
      "mefstat11",
      "uai",
    ])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("constatRentree").execute();
};
