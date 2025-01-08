import type { Kysely } from "kysely";
import { sql } from "kysely";

/**
 * Modification de la table demande pour prendre en compte la notion de campagne
 * ainsi que l'historisation des demandes
 */
export const up = async (db: Kysely<unknown>) => {
  // Drop view to enable dropping the table column
  await db.schema.dropView("latestDemandeView").ifExists().execute();
  await db.schema.dropView("latestDemandeNonMaterializedView").ifExists().execute();

  await db.schema.alterTable("demande").dropColumn("besoinRH").dropColumn("autreBesoinRH").execute();

  await db.schema
    .alterTable("demande")
    .addColumn("recrutementRH", "boolean")
    .addColumn("nbRecrutementRH", "integer")
    .addColumn("discipline1RecrutementRH", "varchar")
    .addColumn("discipline2RecrutementRH", "varchar")
    .addColumn("reconversionRH", "boolean")
    .addColumn("nbReconversionRH", "integer")
    .addColumn("discipline1ReconversionRH", "varchar")
    .addColumn("discipline2ReconversionRH", "varchar")
    .addColumn("professeurAssocieRH", "boolean")
    .addColumn("nbProfesseurAssocieRH", "integer")
    .addColumn("discipline1ProfesseurAssocieRH", "varchar")
    .addColumn("discipline2ProfesseurAssocieRH", "varchar")
    .addColumn("formationRH", "boolean")
    .addColumn("nbFormationRH", "integer")
    .addColumn("discipline1FormationRH", "varchar")
    .addColumn("discipline2FormationRH", "varchar")
    .execute();

  // Refresh view to include new columns
  await db.schema
    .createView("latestDemandeView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom((sq) =>
          // @ts-ignore
          sq
            .selectFrom("demande" as never)
            // @ts-ignore
            .select([sql<number>`max("demande"."dateModification")`.as("dateDerniereModification"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemandes"),
        )
        // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef("latestDemandes.dateDerniereModification", "=", "demande.dateModification"),
        )
        // @ts-ignore
        .selectAll("demande")
        // @ts-ignore
        .where("demande.statut", "!=", "deleted"),
    )
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  // Drop view to enable dropping the table column
  await db.schema.dropView("latestDemandeView").ifExists().execute();

  await db.schema
    .alterTable("demande")
    .addColumn("besoinRH", sql`varchar[]`)
    .addColumn("autreBesoinRH", "varchar")
    .execute();

  await db.schema
    .alterTable("demande")
    .dropColumn("recrutementRH")
    .dropColumn("nbRecrutementRH")
    .dropColumn("discipline1RecrutementRH")
    .dropColumn("discipline2RecrutementRH")
    .dropColumn("reconversionRH")
    .dropColumn("nbReconversionRH")
    .dropColumn("discipline1ReconversionRH")
    .dropColumn("discipline2ReconversionRH")
    .dropColumn("professeurAssocieRH")
    .dropColumn("nbProfesseurAssocieRH")
    .dropColumn("discipline1ProfesseurAssocieRH")
    .dropColumn("discipline2ProfesseurAssocieRH")
    .dropColumn("formationRH")
    .dropColumn("nbFormationRH")
    .dropColumn("discipline1FormationRH")
    .dropColumn("discipline2FormationRH")
    .execute();

  // Refresh view to rollback new columns
  await db.schema
    .createView("latestDemandeView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom((sq) =>
          // @ts-ignore
          sq
            .selectFrom("demande" as never)
            // @ts-ignore
            .select([sql<number>`max("demande"."dateModification")`.as("dateDerniereModification"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemandes"),
        )
        // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef("latestDemandes.dateDerniereModification", "=", "demande.dateModification"),
        )
        // @ts-ignore
        .selectAll("demande")
        // @ts-ignore
        .where("demande.statut", "!=", "deleted"),
    )
    .execute();
};
