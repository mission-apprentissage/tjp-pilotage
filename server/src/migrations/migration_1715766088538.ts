import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
      ALTER TYPE "demandeStatut" RENAME VALUE 'draft' TO 'proposition';
      ALTER TYPE "demandeStatut" RENAME VALUE 'submitted' TO 'demande validée';
      ALTER TYPE "demandeStatut" RENAME VALUE 'refused' TO 'refusée';
      ALTER TYPE "demandeStatut" RENAME VALUE 'deleted' TO 'supprimée';
      ALTER TYPE "demandeStatut" ADD VALUE IF NOT EXISTS 'brouillon';
      ALTER TYPE "demandeStatut" ADD VALUE IF NOT EXISTS 'dossier complet';
      ALTER TYPE "demandeStatut" ADD VALUE IF NOT EXISTS 'dossier incomplet';
      ALTER TYPE "demandeStatut" ADD VALUE IF NOT EXISTS 'projet de demande';
      ALTER TYPE "demandeStatut" ADD VALUE IF NOT EXISTS 'prêt pour le vote';
    `.compile(db)
  );
};

export const down = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
        ALTER TYPE "demandeStatut" RENAME VALUE 'proposition' TO 'draft';
        ALTER TYPE "demandeStatut" RENAME VALUE 'demande validée' TO 'submitted';
        ALTER TYPE "demandeStatut" RENAME VALUE 'refusée' TO 'refused';
        ALTER TYPE "demandeStatut" RENAME VALUE 'supprimée' TO 'deleted';
        `.compile(db)
  );
};
