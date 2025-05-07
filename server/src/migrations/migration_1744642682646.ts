import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("intentionAccessLog").renameTo("demandeAccessLog").execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("demandeAccessLog").renameTo("intentionAccessLog").execute();
};
