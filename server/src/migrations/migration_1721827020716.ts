import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
      BEGIN;

      -- Disable triggers on the demande table
      ALTER TABLE demande DISABLE TRIGGER ALL;

      -- Disable triggers on the intention table
      ALTER TABLE intention DISABLE TRIGGER ALL;

      -- First update statement
      UPDATE demande
      SET "capaciteScolaire" = "capaciteScolaireActuelle",
          "capaciteApprentissage" = "capaciteApprentissageActuelle"
      WHERE "typeDemande" = 'coloration';

      -- Second update statement
      UPDATE intention
      SET "capaciteScolaire" = "capaciteScolaireActuelle",
          "capaciteApprentissage" = "capaciteApprentissageActuelle"
      WHERE "typeDemande" = 'coloration';

      -- Re-enable triggers on the demande table
      ALTER TABLE demande ENABLE TRIGGER ALL;

      -- Re-enable triggers on the intention table
      ALTER TABLE intention ENABLE TRIGGER ALL;

      COMMIT;
  `.compile(db)
  );
};

export const down = async () => {};
