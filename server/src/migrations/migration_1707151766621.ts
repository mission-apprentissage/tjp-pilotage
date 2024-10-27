import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("indicateurAcademie").execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("indicateurAcademie")
    .addColumn("codeAcademie", "varchar(2)", (c) => c.notNull().references("academie.codeAcademie"))
    .addColumn("rentreeScolaire", "varchar(4)", (c) => c.notNull())
    .addColumn("nbDecrocheurs", "integer")
    .addColumn("effectifDecrochage", "integer")
    .addColumn("tauxDecrochage", "integer")
    .addUniqueConstraint("indicateurAcademie_unique_constraint", ["codeAcademie", "rentreeScolaire"])
    .execute();
};
