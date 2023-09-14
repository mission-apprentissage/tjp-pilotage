import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  db.executeQuery(sql`CREATE EXTENSION "unaccent";`.compile(db));
};

export const down = async (db: Kysely<unknown>) => {
  db.executeQuery(sql`DROP EXTENSION "unaccent";`.compile(db));
};
