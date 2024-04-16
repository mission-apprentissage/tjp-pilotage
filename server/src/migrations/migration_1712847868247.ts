import { Kysely } from "kysely";

import { DB } from "../db/schema";

export const up = async (db: Kysely<DB>) => {
  await db.schema
    .createTable("formationRome")
    .addColumn("cfd", "varchar(8)", (cb) => cb.notNull())
    .addUniqueConstraint("formationRome_unique", ["cfd"])
    .addForeignKeyConstraint(
      "formationRomeDataFormation_fk",
      ["cfd"],
      "dataFormation",
      ["cfd"]
    )
    .addColumn("codeRome", "varchar(5)", (cb) => cb.notNull())
    .addForeignKeyConstraint("formationRomeRome_fk", ["codeRome"], "rome", [
      "codeRome",
    ])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable("formationRome").execute();
};
