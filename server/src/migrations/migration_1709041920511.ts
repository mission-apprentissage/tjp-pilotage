import { Kysely } from "kysely";

import { DB } from "../db/db";

export const up = async (db: Kysely<DB>) => {
  db.schema
    .createTable("nsf")
    .addColumn("codeNsf", "varchar(3)", (col) =>
      col.primaryKey().unique().notNull()
    )
    .addColumn("libelleNsf", "varchar", (col) => col.notNull())
    .execute();
};

export const down = async (db: Kysely<DB>) => {
  db.schema.dropTable("nsf").execute();
};
