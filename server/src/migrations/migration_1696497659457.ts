import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("dataFormation")
    .alterColumn("libelle", (c) => c.setNotNull())
    .alterColumn("codeNiveauDiplome", (c) => c.setNotNull())
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("dataFormation")
    .alterColumn("libelle", (c) => c.dropNotNull())
    .alterColumn("codeNiveauDiplome", (c) => c.dropNotNull())
    .execute();
};
