import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
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
  `.compile(db)
  );
};

export const down = async () => {};
