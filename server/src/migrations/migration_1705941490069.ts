import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.alterTable("formationHistorique").dropConstraint("fk_formation").ifExists().execute();

  await db.schema.alterTable("formationHistorique").dropConstraint("fk_formation2").ifExists().execute();
};

export const down = async () => {
  // TODO: handle adding back the constraint
  // await db.schema
  //   .alterTable("formationHistorique")
  //   .addForeignKeyConstraint("fk_formation", ["cfd"], "formation", [
  //     "cfd",
  //   ])
  //   .execute();
  // await db.schema
  //   .alterTable("formationHistorique")
  //   .addForeignKeyConstraint("fk_formation2", ["ancienCFD"], "formation", [
  //     "cfd",
  //   ])
  //   .execute();
};
