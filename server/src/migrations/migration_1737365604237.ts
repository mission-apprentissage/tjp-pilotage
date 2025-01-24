import type {Kysely} from 'kysely';
import { sql} from 'kysely';


export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("campagneRegion")
    .addColumn("id", "uuid", (c) => c.notNull().defaultTo(db.fn("uuid_generate_v4")).unique())
    .addColumn("campagneId", "uuid", (c) => c.references("campagne.id").notNull())
    .addColumn("codeRegion", "varchar(2)", (c) => c.references("region.codeRegion").notNull())
    .addColumn("withPerdir", "boolean", (c) => c.notNull().defaultTo(false))
    .addColumn("dateDebut", "timestamptz", (c) => c.notNull())
    .addColumn("dateFin", "timestamptz", (c) => c.notNull())
    .addColumn("statut", "varchar(30)", (c) => c.notNull())
    .execute();

  await db.schema
    .alterTable("campagneRegion")
    .addUniqueConstraint("campagneRegion_unique_key", ["campagneId", "codeRegion"])
    .execute();

  await sql`
      CREATE TRIGGER t
      AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("campagneRegion")}
          FOR EACH ROW EXECUTE PROCEDURE change_trigger();
    `.execute(db);

  await db.schema
    .alterTable("campagne")
    .alterColumn("dateDebut", (c) => c.setNotNull())
    .alterColumn("dateDebut", (c) => c.setDefault(db.fn("now")))
    .alterColumn("dateFin", (c) => c.setNotNull())
    .alterColumn("dateFin", (c) => c.setDefault(db.fn("now")))
    .execute();

  await db.executeQuery(
    sql`
      INSERT INTO "campagne" ("annee", "statut", "dateDebut", "dateFin") VALUES ('2025', 'en attente', '2025-01-01', '2025-12-31');
    `.compile(db)
  );
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("campagne")
    .alterColumn("dateFin", (c) => c.dropDefault())
    .alterColumn("dateFin", (c) => c.dropNotNull())
    .alterColumn("dateDebut", (c) => c.dropDefault())
    .alterColumn("dateDebut", (c) => c.dropNotNull())
    .execute();

  await sql`DROP TRIGGER t ON ${sql.table("campagneRegion")};`.execute(db);

  await db.schema.dropTable("campagneRegion").execute();
};
