import type { Kysely } from "kysely";
import { sql } from "kysely";

const tables = [
  "formationEtablissement",
  "indicateurSortie",
  "indicateurEntree",
  "indicateurRegionSortie",
  "indicateurEtablissement",
  "dataEtablissement",
  "dataFormation",
  "formation",
  "diplomeProfessionnel",
  "formationHistorique",
  "constatRentree",
  "familleMetier",
  "departement",
  "academie",
  "region",
  "dispositif",
  "etablissement",
  "indicateurAcademie",
  "indicateurRegion",
  "niveauDiplome",
  "user",
  "demande",
];

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable("changeLog")
    .addColumn("id", "serial")
    .addColumn("date", "timestamptz", (c) => c.defaultTo(sql`NOW()`))
    .addColumn("tableName", "text")
    .addColumn("operation", "text")
    .addColumn("user", "text", (c) => c.defaultTo(sql`current_user`))
    .addColumn("newVal", "jsonb")
    .addColumn("oldVal", "jsonb")
    .execute();

  await sql`
    CREATE FUNCTION change_trigger() RETURNS trigger AS $$
    BEGIN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO public."changeLog" ("tableName", operation, "newVal")
                VALUES (TG_RELNAME, TG_OP, row_to_json(NEW));
            RETURN NEW;
        ELSIF TG_OP = 'UPDATE' THEN
            IF (NEW IS NOT DISTINCT FROM OLD) THEN
                RETURN NEW;
            ELSE
                INSERT INTO public."changeLog" ("tableName", operation, "newVal", "oldVal")
                    VALUES (TG_RELNAME, TG_OP, row_to_json(NEW), row_to_json(OLD));
                RETURN NEW;
            END IF;
        ELSIF TG_OP = 'DELETE' THEN
            INSERT INTO public."changeLog" ("tableName", operation, "oldVal")
                VALUES (TG_RELNAME, TG_OP, row_to_json(OLD));
            RETURN OLD;
        END IF;
    END;
    $$ LANGUAGE 'plpgsql' SECURITY DEFINER;
`.execute(db);

  await Promise.all(
    tables.map((table) => {
      sql`
        CREATE TRIGGER t
        AFTER INSERT OR UPDATE OR DELETE ON ${sql.table(table)}
            FOR EACH ROW EXECUTE PROCEDURE change_trigger();
    `.execute(db);
    }),
  );
};

export const down = async (db: Kysely<unknown>) => {
  await tables.map((table) => {
    sql`DROP TRIGGER t ON ${sql.table(table)};`.execute(db);
  });
  await sql`drop function change_trigger;`.execute(db);
  await db.schema.dropTable("changeLog").execute();
};
