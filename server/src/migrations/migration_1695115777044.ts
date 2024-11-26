/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Kysely } from "kysely";

export const up = async (db: Kysely<any>) => {
  await db.schema
    .alterTable("demande")
    .addColumn("compensationUai", "varchar(8)")
    .addColumn("compensationCfd", "varchar(8)")
    .addColumn("compensationDispositifId", "varchar(3)")
    .addColumn("compensationRentreeScolaire", "integer")
    .dropColumn("libelleDiplome")
    .execute();

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

export const down = async (db: Kysely<any>) => {
  await db.schema.alterTable("demande").dropConstraint("demande_compensation_unique_constraint").execute();

  await db.schema
    .alterTable("demande")
    .dropColumn("compensationUai")
    .dropColumn("compensationCfd")
    .dropColumn("compensationDispositifId")
    .dropColumn("compensationRentreeScolaire")
    .addColumn("libelleDiplome", "varchar")
    .execute();
};
