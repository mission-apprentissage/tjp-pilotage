import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("correction")
    .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(db.fn("uuid_generate_v4")).notNull())
    .addColumn("intentionNumero", "varchar", (c) => c.notNull())
    .addColumn("createdBy", "uuid", (c) => c.notNull())
    .addColumn("updatedBy", "uuid", (c) => c.notNull())
    .addColumn("createdAt", "timestamptz", (c) => c.notNull().defaultTo(sql`NOW()`))
    .addColumn("updatedAt", "timestamptz", (c) => c.notNull().defaultTo(sql`NOW()`))
    .addColumn("raison", "varchar")
    .addColumn("motif", "varchar")
    .addColumn("autreMotif", "varchar")
    .addColumn("commentaire", "varchar")
    .addColumn("capaciteScolaire", "integer")
    .addColumn("capaciteApprentissage", "integer")
    .addColumn("capaciteScolaireActuelle", "integer")
    .addColumn("capaciteApprentissageActuelle", "integer")
    .addColumn("capaciteScolaireColoree", "integer")
    .addColumn("capaciteApprentissageColoree", "integer")
    .addColumn("campagneId", "uuid", (c) => c.notNull())
    .execute();

  await db.schema
    .alterTable("correction")
    .addForeignKeyConstraint("fk_correction_createdBy_user", ["createdBy"], "user", ["id"]).execute;

  await db.schema
    .alterTable("correction")
    .addForeignKeyConstraint("fk_correction_updatedBy_user", ["updatedBy"], "user", ["id"]).execute;

  await db.schema
    .alterTable("correction")
    .addForeignKeyConstraint("fk_correction_campagneId_campagne", ["campagneId"], "campagne", ["id"])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("correction").execute();
};
