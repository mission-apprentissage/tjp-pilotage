import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("tensionRomeRegion")
    .addColumn("codeRome", "varchar(5)", (c) => c.references("rome.codeRome").onDelete("cascade").notNull())
    .addColumn("codeRegion", "varchar(100)", (c) => c.references("region.codeRegion").onDelete("cascade").notNull())
    .addColumn("codeTension", "varchar(100)", (c) => c.references("tension.codeTension").onDelete("cascade").notNull())
    .addColumn("annee", "varchar(4)", (c) => c.notNull())
    .addColumn("valeur", "integer", (c) => c.notNull())
    .execute();

  await db.schema
    .alterTable("tensionRomeRegion")
    .addUniqueConstraint("tensionRomeRegion_unique_constraint", ["codeRome", "codeRegion", "codeTension", "annee"])
    .execute();

  await db.schema
    .createTable("tensionRome")
    .addColumn("codeRome", "varchar(5)", (c) => c.references("rome.codeRome").onDelete("cascade").notNull())
    .addColumn("codeTension", "varchar(100)", (c) => c.references("tension.codeTension").onDelete("cascade").notNull())
    .addColumn("annee", "varchar(4)", (c) => c.notNull())
    .addColumn("valeur", "integer", (c) => c.notNull())
    .execute();

  await db.schema
    .alterTable("tensionRome")
    .addUniqueConstraint("tensionRome_unique_constraint", ["codeRome", "codeTension", "annee"])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("tensionRome").execute();
  await db.schema.dropTable("tensionRomeRegion").execute();
};
