/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .alterTable("dataFormation")
    .alterColumn("libelle", (c) => c.setNotNull())
    .alterColumn("codeNiveauDiplome", (c) => c.setNotNull())
    .execute();

  await db.schema
    .alterTable("indicateurRegionSortie")
    .addColumn("cfdContinuum", "varchar(8)", (c) => c.references("formation.codeFormationDiplome"))
    .execute();

  await db.schema
    .alterTable("demande")
    .addForeignKeyConstraint("fk_demande_user", ["createurId"], "user", ["id"])
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema
    .alterTable("dataFormation")
    .alterColumn("libelle", (c) => c.dropNotNull())
    .alterColumn("codeNiveauDiplome", (c) => c.dropNotNull())
    .execute();

  await db.schema.alterTable("indicateurRegionSortie").dropColumn("cfdContinuum").execute();

  await db.schema.alterTable("demande").dropConstraint("fk_demande_user").execute();
};
