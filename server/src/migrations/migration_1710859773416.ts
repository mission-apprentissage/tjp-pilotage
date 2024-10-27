import type { Kysely } from "kysely";
import { sql } from "kysely";

/**
 * Modification de la table demande pour prendre en compte la notion de campagne
 * ainsi que l'historisation des demandes
 */
export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("demande").addColumn("campagneId", "uuid").execute();

  await db.schema
    .alterTable("demande")
    .addForeignKeyConstraint("demande_campagneId_fk", ["campagneId"], "campagne", ["id"])
    .execute();

  await db.schema.alterTable("demande").dropConstraint("demande_pkey").ifExists().execute();

  await db.schema.alterTable("demande").dropConstraint("demande_id_key").ifExists().execute();

  await db.schema.alterTable("demande").dropConstraint("demande_unique_constraint").ifExists().execute();

  await db.schema.alterTable("demande").renameColumn("id", "numero").execute();

  await db.schema
    .alterTable("demande")
    .alterColumn("numero", (c) => c.setNotNull())
    .execute();

  await db.schema
    .alterTable("demande")
    .addColumn("id", "uuid", (c) => c.defaultTo(db.fn("uuid_generate_v4")))
    .execute();

  await db.schema.alterTable("demande").addPrimaryKeyConstraint("demande_pkey", ["id"]).execute();

  await db.schema.alterTable("demande").addColumn("numeroHistorique", "varchar(8)").execute();

  await db.schema.alterTable("demande").renameColumn("dispositifId", "codeDispositif").execute();

  await db.schema
    .alterTable("demande")
    .renameColumn("compensationDispositifId", "compensationCodeDispositif")
    .execute();

  await db.schema.alterTable("demande").renameColumn("status", "statut").execute();

  await db.schema.alterTable("demande").renameColumn("createdAt", "dateCreation").execute();

  await db.schema.alterTable("demande").renameColumn("updatedAt", "dateModification").execute();

  // Ne passe pas via le updateTable de kysely
  await db.executeQuery(
    sql`
    UPDATE "demande"
    SET "campagneId" = (SELECT "id" FROM "campagne" WHERE "annee" = '2023')
    WHERE "dateCreation" < '2024-03-19'::timestamp with time zone;
  `.compile(db)
  );
};

export const down = async (db: Kysely<unknown>) => {
  // On delete les doublons sur les demandes en récupérants les plus récentes
  await db.executeQuery(
    sql`
      DELETE FROM "demande" d1
      USING "demande" d2
      WHERE d1."dateModification" < d2."dateModification"
      AND d1.numero = d2.numero;
  `.compile(db)
  );

  await db.schema.alterTable("demande").renameColumn("dateModification", "updatedAt").execute();

  await db.schema.alterTable("demande").renameColumn("dateCreation", "createdAt").execute();

  await db.schema.alterTable("demande").renameColumn("statut", "status").execute();

  await db.schema
    .alterTable("demande")
    .renameColumn("compensationCodeDispositif", "compensationDispositifId")
    .execute();

  await db.schema.alterTable("demande").renameColumn("codeDispositif", "dispositifId").execute();

  await db.schema.alterTable("demande").dropColumn("numeroHistorique").execute();

  await db.schema.alterTable("demande").dropColumn("id").execute();

  await db.schema.alterTable("demande").renameColumn("numero", "id").execute();

  await db.schema.alterTable("demande").addPrimaryKeyConstraint("demande_pkey", ["id"]).execute();

  await db.schema
    .alterTable("demande")
    .addUniqueConstraint("demande_unique_constraint", ["uai", "cfd", "dispositifId", "rentreeScolaire", "libelleFCIL"])
    .execute();

  await db.schema.alterTable("demande").dropConstraint("demande_campagneId_fk").ifExists().execute();

  await db.schema.alterTable("demande").dropColumn("campagneId").execute();
};
