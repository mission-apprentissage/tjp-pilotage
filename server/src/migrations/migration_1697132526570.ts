import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  db.schema
    .alterTable("demande")
    .dropConstraint("demande_compensation_unique_constraint")
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("demande")
    .addUniqueConstraint("demande_compensation_unique_constraint", [
      "compensationUai",
      "compensationCfd",
      "compensationDispositifId",
      "compensationRentreeScolaire",
    ])
    .execute();
};
