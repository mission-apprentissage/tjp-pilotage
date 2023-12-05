import { Kysely, sql } from 'kysely';

// Méthode issue de https://blog.yo1.dog/updating-enum-values-in-postgresql-the-safe-and-easy-way/

export const up = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
      ALTER TYPE "demandeStatus" RENAME TO "demandeStatus_old";

      CREATE TYPE "demandeStatus" AS ENUM ('draft', 'submitted', 'refused');

      ALTER TABLE "demande" ALTER COLUMN "status" TYPE "demandeStatus" USING "status"::text::"demandeStatus";

      DROP TYPE "demandeStatus_old";
    `.compile(db)
  );
};

export const down = async (db: Kysely<unknown>) => {

  await db.executeQuery(
    sql`
      ALTER TYPE "demandeStatus" RENAME TO "demandeStatus_old";

      CREATE TYPE "demandeStatus" AS ENUM ('draft', 'submitted');

      ALTER TABLE "demande" ALTER COLUMN "status" TYPE "demandeStatus" USING "status"::text::"demandeStatus";

      DROP TYPE "demandeStatus_old";
    `.compile(db)
  )

    ;
};
