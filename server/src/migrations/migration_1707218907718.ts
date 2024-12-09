import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("indicateurDepartement")
    .addColumn("codeDepartement", "varchar(3)", (c) => c.notNull().references("departement.codeDepartement"))
    .addColumn("rentreeScolaire", "varchar(4)", (c) => c.notNull())
    .addColumn("tauxChomage", "float4")
    .addUniqueConstraint("indicateurDepartement_unique_constraint", ["codeDepartement", "rentreeScolaire"])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("indicateurDepartement").execute();
};
