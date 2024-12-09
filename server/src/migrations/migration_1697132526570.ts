/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";

export const up = async (db: Kysely<any>) => {
  db.schema.alterTable("demande").dropConstraint("demande_compensation_unique_constraint").execute();
};

export const down = async (db: Kysely<any>) => {
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
