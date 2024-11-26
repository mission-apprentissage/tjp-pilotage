/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createTable("indicateurRegion")
    .addColumn("codeRegion", "varchar(2)", (c) => c.notNull().references("region.codeRegion"))
    .addColumn("rentreeScolaire", "varchar(4)", (c) => c.notNull())
    .addColumn("nbDecrocheurs", "integer")
    .addColumn("effectifDecrochage", "integer")
    .addColumn("tauxDecrochage", "integer")
    .addUniqueConstraint("indicateurRegion_unique_constraint", ["codeRegion", "rentreeScolaire"])
    .execute();

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
export const down = async () => {};
