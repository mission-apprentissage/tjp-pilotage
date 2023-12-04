import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("indicateurSortie")
    .addColumn("cfdContinuum", "varchar(8)", (c) =>
      c.references("formation.codeFormationDiplome")
    )
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("indicateurSortie")
    .dropColumn("cfdContinuum")
    .execute();
};
