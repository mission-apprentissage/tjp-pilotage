import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("formationHistorique").dropConstraint("formationhistorique_pk").execute();

  await db.schema.alterTable("formationHistorique").renameColumn("codeFormationDiplome", "cfd").execute();

  await db.schema.alterTable("formationHistorique").addColumn("voie", "varchar").execute();

  // Pour ajouter la voie dans la PK il faut truncate la table car elle ne peut pas contenir de valeurs nulles pour la colonne voie, cela implique de devoir repasser importFormations après la migration
  await db.executeQuery(sql`TRUNCATE TABLE "formationHistorique";`.compile(db));

  await db.schema
    .alterTable("formationHistorique")
    .addPrimaryKeyConstraint("formationhistorique_pk", ["ancienCFD", "cfd", "voie"])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("formationHistorique").dropConstraint("formationhistorique_pk").execute();

  await db.schema.alterTable("formationHistorique").dropColumn("voie").execute();

  await db.schema.alterTable("formationHistorique").renameColumn("cfd", "codeFormationDiplome").execute();

  // Pour revert il faut truncate la table car la PK n'accepte pas de valeurs communes, cela implique de devoir repasser importFormations après la migration
  await db.executeQuery(sql`TRUNCATE TABLE "formationHistorique";`.compile(db));

  await db.schema
    .alterTable("formationHistorique")
    .addPrimaryKeyConstraint("formationhistorique_pk", ["ancienCFD", "codeFormationDiplome"])
    .execute();
};
