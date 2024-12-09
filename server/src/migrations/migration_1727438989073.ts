import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("etablissement").renameColumn("UAI", "uai").execute();

  await db.schema.alterTable("formationEtablissement").renameColumn("dispositifId", "codeDispositif").execute();

  await db.schema.alterTable("formationEtablissement").renameColumn("UAI", "uai").execute();

  await db.schema.alterTable("indicateurEtablissement").renameColumn("UAI", "uai").execute();

  await db.schema.alterTable("indicateurRegionSortie").renameColumn("dispositifId", "codeDispositif").execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("etablissement").renameColumn("uai", "UAI").execute();

  await db.schema.alterTable("formationEtablissement").renameColumn("codeDispositif", "dispositifId").execute();

  await db.schema.alterTable("formationEtablissement").renameColumn("uai", "UAI").execute();

  await db.schema.alterTable("indicateurEtablissement").renameColumn("uai", "UAI").execute();

  await db.schema.alterTable("indicateurRegionSortie").renameColumn("codeDispositif", "dispositifId").execute();
};
