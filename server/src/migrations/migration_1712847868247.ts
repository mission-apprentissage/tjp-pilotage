import { Kysely } from "kysely";

import { DB } from "../db/schema";

export const up = async (db: Kysely<DB>) => {
  await db.schema
    .createTable("formationRome")
    .addColumn("cfd", "varchar(8)")
    .addUniqueConstraint("formationRome_unique_constraint", ["cfd"])
    .addForeignKeyConstraint(
      "fk_formationRomeDataFormation",
      ["cfd"],
      "dataFormation",
      ["cfd"]
    )
    .addColumn("codeRome", "varchar(5)")
    .addForeignKeyConstraint("fk_formationRomeRome", ["codeRome"], "rome", [
      "codeRome",
    ])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("formationRome").execute();
};
