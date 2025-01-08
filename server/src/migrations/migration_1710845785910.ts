import type { Kysely } from "kysely";
import { sql } from "kysely";

const tables = ["indicateurDepartement", "nsf"];

/**
 * Ajout des dernières tables ajoutées à la base au trigger changeLog
 */
export const up = async (db: Kysely<unknown>) => {
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
};
