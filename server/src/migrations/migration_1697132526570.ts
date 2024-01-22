import { Kysely } from "kysely";

export const up = async (db: Kysely<never>) => {
  db.schema
    .alterTable("demande")
    .dropConstraint("demande_compensation_unique_constraint")
    .execute();
};

export const down = async (db: Kysely<never>) => {
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
