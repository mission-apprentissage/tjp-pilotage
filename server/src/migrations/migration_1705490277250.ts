import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("familleMetier").dropColumn("libelleOfficielSpecialite").execute();

  await db.schema.alterTable("familleMetier").renameColumn("libelleOfficielFamille", "libelleFamille").execute();

  await db.schema.alterTable("familleMetier").renameColumn("cfdSpecialite", "cfd").execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("familleMetier").addColumn("libelleOfficielSpecialite", "varchar").execute();

  await db.schema.alterTable("familleMetier").renameColumn("libelleFamille", "libelleOfficielFamille").execute();

  await db.schema.alterTable("familleMetier").renameColumn("cfd", "cfdSpecialite").execute();
};
