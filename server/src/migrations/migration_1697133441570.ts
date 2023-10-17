import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("demande")
    .dropConstraint("demande_unique_constraint")
    .execute();

  await db.schema
    .alterTable("demande")
    .addUniqueConstraint("demande_unique_constraint", [
      "uai",
      "cfd",
      "dispositifId",
      "rentreeScolaire",
      "libelleFCIL",
    ])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("demande")
    .dropConstraint("demande_unique_constraint")
    .execute();

  await db.schema
    .alterTable("demande")
    .addUniqueConstraint("demande_unique_constraint", [
      "uai",
      "cfd",
      "dispositifId",
      "rentreeScolaire",
    ])
    .execute();
};