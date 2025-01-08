import type { Kysely } from "kysely";
import { sql } from "kysely";

/**
 * Création de la notion de campagne pour les intentions d'ouverture/fermeture de formations
 */
export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("campagne")
    .addColumn("id", "uuid", (c) => c.notNull().defaultTo(db.fn("uuid_generate_v4")).unique())
    .addColumn("annee", "varchar(4)", (c) => c.notNull())
    .addColumn("dateDebut", "timestamptz")
    .addColumn("dateFin", "timestamptz")
    .addColumn("statut", "varchar(30)", (c) => c.notNull())
    .addPrimaryKeyConstraint("campagne_pkey", ["id", "annee"])
    .execute();

  await sql`
        CREATE TRIGGER t
        AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("campagne")}
            FOR EACH ROW EXECUTE PROCEDURE change_trigger();
    `.execute(db);

  // Ne passe pas via le insertInto de kysely
  await db.executeQuery(
    sql`
    INSERT INTO "campagne" ("annee", "dateDebut", "statut") VALUES ('2023', '2023-10-03'::timestamp with time zone, 'terminée');
    INSERT INTO "campagne" ("annee", "statut") VALUES ('2024', 'en attente');
  `.compile(db),
  );
};

export const down = async (db: Kysely<unknown>) => {
  await sql`DROP TRIGGER t ON ${sql.table("campagne")};`.execute(db);

  await db.schema.dropTable("campagne").execute();
};
