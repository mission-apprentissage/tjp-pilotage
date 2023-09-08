import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("dataEtablissement")
    .addColumn("uai", "varchar(8)", (c) => c.primaryKey())
    .addColumn("libelle", "varchar")
    .addColumn("commune", "varchar")
    .addColumn("siret", "varchar(14)")
    .addColumn("adresse", "varchar")
    .addColumn("codePostal", "varchar(5)")
    .addColumn("codeMinistereTutuelle", "varchar(2)")
    .addColumn("secteur", "varchar(2)")
    .addColumn("codeDepartement", "varchar(3)", (c) =>
      c.references("departement.codeDepartement")
    )
    .addColumn("codeAcademie", "varchar(2)", (c) =>
      c.references("academie.codeAcademie")
    )
    .addColumn("codeRegion", "varchar(2)", (c) =>
      c.references("region.codeRegion")
    )
    .execute();

  await db.schema
    .createTable("dataFormation")
    .addColumn("cfd", "varchar(8)", (c) => c.primaryKey())
    .addColumn("rncp", "int4")
    .addColumn("libelle", "varchar")
    .addColumn("codeNiveauDiplome", "varchar(3)")
    .addColumn("cpc", "varchar")
    .addColumn("cpcSecteur", "varchar")
    .addColumn("cpcSousSecteur", "varchar")
    .addColumn("libelleFiliere", "varchar")
    .addColumn("dateOuverture", "date")
    .addColumn("dateFermeture", "date")
    .addColumn("contexteFamilleMetier", "boolean", (c) => c.notNull())
    .execute();
};

export const down = async () => {};
