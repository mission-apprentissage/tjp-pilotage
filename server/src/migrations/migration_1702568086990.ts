/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable("constatRentree")
    .addColumn("rentreeScolaire", "varchar")
    .addColumn("mefstat11", "varchar")
    .addColumn("uai", "varchar")
    .addColumn("effectif", "integer")
    .addColumn("anneeDispositif", "integer")
    .addColumn("cfd", "varchar")
    .addUniqueConstraint("constatRentree_unique_constraint", ["rentreeScolaire", "mefstat11", "uai"])
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable("constatRentree").execute();
};
