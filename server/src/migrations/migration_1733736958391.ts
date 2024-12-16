import type { Kysely } from "kysely";
import { sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await sql`CREATE EXTENSION pg_cron;`.execute(db);

  await sql`
      CREATE OR REPLACE FUNCTION check_inactive_users() RETURNS trigger AS $$
      BEGIN
        IF COALESCE(OLD.lastSeenAt, OLD.createdAt) < NOW() - INTERVAL '2 years' THEN
          NEW.email := CONCAT('anonyme_', NEW.id, '@orion.inserjeunes.beta.gouv.fr');
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
    SELECT cron.schedule(
      'anonymize_users_daily', -- Nom du job
      '0 0 * * *',             -- Expression CRON (ici, chaque jour à minuit)
      $$CALL check_inactive_users();$$ -- Appel de la fonction SQL
    );
  `.execute(db);

  await sql`SELECT * FROM cron.job;`.execute(db);

  await sql`
    UPDATE ${sql.table("user")}
    SET
        email = CONCAT('anonyme_', id, '@orion.inserjeunes.beta.gouv.fr'),
        firstname = 'Utilisateur',
        lastname = 'Anonyme',
        password = NULL,
        enabled = false
    WHERE COALESCE(${sql.ref("user.lastSeenAt")}, ${sql.ref("user.createdAt")}) < NOW() - INTERVAL '2 years';
  `.execute(db);
};

export const down = async (db: Kysely<unknown>) => {
  await sql`SELECT cron.unschedule('anonymize_users_daily');`.execute(db);

  await sql`DROP EXTENSION pg_cron;`.execute(db);

  await sql`DROP FUNCTION check_inactive_users();`.execute(db);
};
