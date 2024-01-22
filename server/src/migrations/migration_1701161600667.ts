import { Kysely } from "kysely";

export const up = async (db: Kysely<never>) => {
  await db.schema
    .alterTable("indicateurSortie")
    .addColumn("cfdContinuum", "varchar(8)", (c) =>
      c.references("formation.codeFormationDiplome")
    )
    .execute();
};

export const down = async (db: Kysely<never>) => {
  await db.schema
    .alterTable("indicateurSortie")
    .dropColumn("cfdContinuum")
    .execute();
};
