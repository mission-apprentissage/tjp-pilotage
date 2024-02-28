import { Kysely } from "kysely";

import { DB } from "../db/db";

export const up = async (db: Kysely<DB>) => {
  await db.schema
    .alterTable("dataFormation")
    .addColumn("codeNsf", "varchar(3)")
    .execute();

  await db.schema
    .alterTable("dataFormation")
    .addForeignKeyConstraint("fk_nsf", ["codeNsf"], "nsf", ["codeNsf"])
    .execute();
};

export const down = async (db: Kysely<DB>) => {
  db.schema
    .alterTable("dataFormation")
    .dropConstraint("fk_nsf")
    .ifExists()
    .execute();

  db.schema.alterTable("dataFormation").dropColumn("codeNsf").execute();
};
