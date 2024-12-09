import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await sql`
      CREATE OR REPLACE FUNCTION check_inactive_users() RETURNS trigger AS $$
      BEGIN
        IF COALESCE(OLD.lastSeenAt, OLD.createdAt) < NOW() - INTERVAL '2 years' THEN
          NEW.email := CONCAT('anonyme_', NEW.id, '@orion.fr');
          NEW.firstname := 'Utilisateur';
          NEW.lastname := 'Anonyme';
          NEW.password := NULL;
          NEW.enabled := false;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE 'plpgsql' SECURITY DEFINER;
  `.execute(db);

  await sql`
    CREATE TRIGGER update_inactive_users_t
    BEFORE UPDATE ON ${sql.table("user")}
    FOR EACH ROW EXECUTE PROCEDURE check_inactive_users();
  `.execute(db);

  await sql`
    UPDATE ${sql.table("user")}
    SET
        email = CONCAT('anonyme_', id, '@orion.fr'),
        firstname = 'Utilisateur',
        lastname = 'Anonyme',
        password = NULL,
        enabled = false
    WHERE COALESCE(${sql.ref("user.lastSeenAt")}, ${sql.ref("user.createdAt")}) < NOW() - INTERVAL '2 years';
  `.execute(db);
};

export const down = async (db: Kysely<unknown>) => {
  await sql`DROP TRIGGER update_inactive_users_t ON ${sql.table("user")}`.execute(db);
  await sql`DROP FUNCTION check_inactive_users()`.execute(db);
};
