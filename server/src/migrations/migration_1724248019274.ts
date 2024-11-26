import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("tension")
    .addColumn("codeTension", "varchar(100)", (c) => c.notNull())
    .addColumn("libelleTension", "varchar(100)", (c) => c.notNull())
    .addUniqueConstraint("tension_unique_constraint", ["codeTension"])
    .execute();

  await db.schema
    .createTable("tensionRomeDepartement")
    .addColumn("codeRome", "varchar(5)", (c) => c.references("rome.codeRome").onDelete("cascade").notNull())
    .addColumn("codeDepartement", "varchar(100)", (c) =>
      c.references("departement.codeDepartement").onDelete("cascade").notNull()
    )
    .addColumn("codeTension", "varchar(100)", (c) => c.references("tension.codeTension").onDelete("cascade").notNull())
    .addColumn("annee", "varchar(4)", (c) => c.notNull())
    .addColumn("valeur", "integer", (c) => c.notNull())
    .addUniqueConstraint("tensionRomeDepartement_unique", ["codeRome", "codeDepartement", "codeTension", "annee"])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("tensionRomeDepartement").execute();
  await db.schema.dropTable("tension").execute();
};
