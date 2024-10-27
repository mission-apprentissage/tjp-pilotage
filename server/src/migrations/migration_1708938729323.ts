import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) =>
  db.schema
    .alterTable("etablissement")
    .addColumn("latitude", "float8")
    .addColumn("longitude", "float8")
    .addColumn("sourceGeoloc", "varchar(50)")
    .execute();

export const down = async (db: Kysely<unknown>) =>
  db.schema
    .alterTable("etablissement")
    .dropColumn("latitude")
    .dropColumn("longitude")
    .dropColumn("sourceGeoloc")
    .execute();
