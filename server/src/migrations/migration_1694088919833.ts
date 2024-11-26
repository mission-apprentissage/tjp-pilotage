/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .createType("typeUai")
    .asEnum([
      "1ORD",
      "9999",
      "ADLE",
      "AGRI",
      "AIDE",
      "APPL",
      "CDES",
      "CDP",
      "CFA",
      "CFIS",
      "CFPA",
      "CLG",
      "CNED",
      "CONT",
      "CSAV",
      "DIV",
      "EFE",
      "EME",
      "EREA",
      "ERPD",
      "ETRA",
      "EUR",
      "EXP",
      "FORP",
      "GRET",
      "HOSP",
      "IEN",
      "ING",
      "IO",
      "IUFM",
      "JS",
      "LP",
      "LYC",
      "ONIS",
      "OUS",
      "PBAC",
      "PRES",
      "PRSU",
      "RECH",
      "RECT",
      "SDEN",
      "SEP",
      "SERV",
      "SES",
      "SET",
      "SGT",
      "SMUT",
      "SOC",
      "SPEC",
      "SSEF",
      "TSGE",
      "UNIV",
    ])
    .execute();

  await db.schema.createType("typeFamille").asEnum(["2nde_commune", "specialite"]).execute();

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
    .addColumn("codeDepartement", "varchar(3)", (c) => c.references("departement.codeDepartement"))
    .addColumn("codeAcademie", "varchar(2)", (c) => c.references("academie.codeAcademie"))
    .addColumn("codeRegion", "varchar(2)", (c) => c.references("region.codeRegion"))
    .addColumn("typeUai", sql`"typeUai"`, (c) => c.notNull())
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
    .addColumn("typeFamille", sql`"typeFamille"`)
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.dropTable("dataEtablissement").execute();
  await db.schema.dropTable("dataFormation").execute();
  await db.schema.dropType("typeUai").execute();
  await db.schema.dropType("typeFamille").execute();
};
