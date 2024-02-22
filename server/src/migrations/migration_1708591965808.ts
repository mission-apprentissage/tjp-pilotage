import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("formationHistorique")
    .dropConstraint("formationhistorique_pk")
    .execute();

  await db.schema
    .alterTable("formationHistorique")
    .dropColumn("codeFormationDiplome")
    .execute();

  await db.schema
    .alterTable("formationHistorique")
    .addColumn("cfd", "varchar")
    .execute();

  await db.schema
    .alterTable("formationHistorique")
    .addColumn("voie", "varchar")
    .execute();

  await db.executeQuery(sql`TRUNCATE TABLE "formationHistorique";`.compile(db));

  await db.schema
    .alterTable("formationHistorique")
    .addPrimaryKeyConstraint("formationhistorique_pk", [
      "ancienCFD",
      "cfd",
      "voie",
    ])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("formationHistorique")
    .dropConstraint("formationhistorique_pk")
    .execute();

  await db.schema
    .alterTable("formationHistorique")
    .dropColumn("voie")
    .execute();

  await db.schema.alterTable("formationHistorique").dropColumn("cfd").execute();

  await db.schema
    .alterTable("formationHistorique")
    .addColumn("codeFormationDiplome", "varchar")
    .execute();

  await db.schema
    .alterTable("formationHistorique")
    .addPrimaryKeyConstraint("formationhistorique_pk", [
      "ancienCFD",
      "codeFormationDiplome",
    ])
    .execute();
};
