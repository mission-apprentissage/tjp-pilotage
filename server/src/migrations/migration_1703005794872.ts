import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("academie").renameColumn("libelle", "libelleAcademie").execute();

  await db.schema.alterTable("dataEtablissement").renameColumn("libelle", "libelleEtablissement").execute();

  await db.schema.alterTable("dataFormation").renameColumn("libelle", "libelleFormation").execute();

  await db.schema.alterTable("departement").renameColumn("libelle", "libelleDepartement").execute();

  await db.schema.alterTable("formation").renameColumn("libelleDiplome", "libelleFormation").execute();

  await db.schema.alterTable("formation").renameColumn("CPCSecteur", "cpcSecteur").execute();

  await db.schema.alterTable("formation").renameColumn("CPCSousSecteur", "cpcSousSecteur").execute();

  await db.schema
    .alterTable("indicateurEntree")
    .dropColumn("capacite")
    .dropColumn("effectifEntree")
    .dropColumn("nbPremiersVoeux")
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("indicateurEntree")
    .addColumn("nbPremiersVoeux", "integer")
    .addColumn("effectifEntree", "integer")
    .addColumn("capacite", "integer")
    .execute();

  await db.schema.alterTable("formation").renameColumn("cpcSousSecteur", "CPCSousSecteur").execute();

  await db.schema.alterTable("formation").renameColumn("cpcSecteur", "CPCSecteur").execute();

  await db.schema.alterTable("formation").renameColumn("libelleFormation", "libelleDiplome").execute();

  await db.schema.alterTable("departement").renameColumn("libelleDepartement", "libelle").execute();

  await db.schema.alterTable("dataFormation").renameColumn("libelleFormation", "libelle").execute();

  await db.schema.alterTable("dataEtablissement").renameColumn("libelleEtablissement", "libelle").execute();

  await db.schema.alterTable("academie").renameColumn("libelleAcademie", "libelle").execute();
};
