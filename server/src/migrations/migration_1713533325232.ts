import type { Kysely } from "kysely";
import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createView("demandeIntentionView")
    .as(
      getKbdClient()
        .selectFrom("intention")
        // @ts-ignore
        .select([
          "numero",
          "cfd",
          "codeDispositif",
          "uai",
          "rentreeScolaire",
          "typeDemande",
          "motif",
          "autreMotif",
          "coloration",
          "libelleColoration",
          "amiCma",
          "amiCmaValide",
          "amiCmaEnCoursValidation",
          "amiCmaValideAnnee",
          "statut",
          "commentaire",
          "codeRegion",
          "codeAcademie",
          "createurId",
          "createdAt",
          "capaciteScolaire",
          "capaciteScolaireActuelle",
          "capaciteScolaireColoree",
          "capaciteApprentissage",
          "capaciteApprentissageActuelle",
          "capaciteApprentissageColoree",
          "mixte",
          "updatedAt",
          "libelleFCIL",
          "motifRefus",
          "autreMotifRefus",
          "campagneId",
          "id",
          "numeroHistorique",
          "recrutementRH",
          "nbRecrutementRH",
          "discipline1RecrutementRH",
          "discipline2RecrutementRH",
          "reconversionRH",
          "nbReconversionRH",
          "discipline1ReconversionRH",
          "discipline2ReconversionRH",
          "professeurAssocieRH",
          "nbProfesseurAssocieRH",
          "discipline1ProfesseurAssocieRH",
          "discipline2ProfesseurAssocieRH",
          "formationRH",
          "nbFormationRH",
          "discipline1FormationRH",
          "discipline2FormationRH",
          "partenairesEconomiquesImpliques",
          "partenaireEconomique1",
          "partenaireEconomique2",
          "cmqImplique",
          "filiereCmq",
          "nomCmq",
          "besoinRHPrecisions",
          "travauxAmenagement",
          "travauxAmenagementDescription",
          "achatEquipement",
          "achatEquipementDescription",
          "augmentationCapaciteAccueilHebergement",
          "augmentationCapaciteAccueilHebergementPlaces",
          "augmentationCapaciteAccueilHebergementPrecisions",
          "augmentationCapaciteAccueilRestauration",
          "augmentationCapaciteAccueilRestaurationPlaces",
          "augmentationCapaciteAccueilRestaurationPrecisions",
        ])
        .union(
          // @ts-expect-error
          getKbdClient()
            .selectFrom("demande")
            // @ts-expect-error
            .select([
              "numero",
              "cfd",
              "codeDispositif",
              "uai",
              "rentreeScolaire",
              "typeDemande",
              "motif",
              "autreMotif",
              "coloration",
              "libelleColoration",
              "amiCma",
              "amiCmaValide",
              "amiCmaEnCoursValidation",
              "amiCmaValideAnnee",
              "statut",
              "commentaire",
              "codeRegion",
              "codeAcademie",
              "createurId",
              "createdAt",
              "capaciteScolaire",
              "capaciteScolaireActuelle",
              "capaciteScolaireColoree",
              "capaciteApprentissage",
              "capaciteApprentissageActuelle",
              "capaciteApprentissageColoree",
              "mixte",
              "updatedAt",
              "libelleFCIL",
              "motifRefus",
              "autreMotifRefus",
              "campagneId",
              "id",
              "numeroHistorique",
              "recrutementRH",
              "nbRecrutementRH",
              "discipline1RecrutementRH",
              "discipline2RecrutementRH",
              "reconversionRH",
              "nbReconversionRH",
              "discipline1ReconversionRH",
              "discipline2ReconversionRH",
              "professeurAssocieRH",
              "nbProfesseurAssocieRH",
              "discipline1ProfesseurAssocieRH",
              "discipline2ProfesseurAssocieRH",
              "formationRH",
              "nbFormationRH",
              "discipline1FormationRH",
              "discipline2FormationRH",
              sql<boolean>`null`.as("partenairesEconomiquesImpliques"),
              sql<string>`null`.as("partenaireEconomique1"),
              sql<string>`null`.as("partenaireEconomique2"),
              sql<boolean>`null`.as("cmqImplique"),
              sql<string>`null`.as("filiereCmq"),
              sql<string>`null`.as("nomCmq"),
              sql<string>`null`.as("besoinRHPrecisions"),
              sql<boolean>`null`.as("travauxAmenagement"),
              sql<string>`null`.as("travauxAmenagementDescription"),
              sql<boolean>`null`.as("achatEquipement"),
              sql<string>`null`.as("achatEquipementDescription"),
              sql<boolean>`null`.as("augmentationCapaciteAccueilHebergement"),
              sql<number>`null`.as("augmentationCapaciteAccueilHebergementPlaces"),
              sql<string>`null`.as("augmentationCapaciteAccueilHebergementPrecisions"),
              sql<boolean>`null`.as("augmentationCapaciteAccueilRestauration"),
              sql<number>`null`.as("augmentationCapaciteAccueilRestaurationPlaces"),
              sql<string>`null`.as("augmentationCapaciteAccueilRestaurationPrecisions"),
            ])
        )
    )
    .materialized()
    .execute();

  await db.schema
    .createIndex("demandeIntentionView_index")
    .unique()
    .on("demandeIntentionView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createurId", "codeDispositif"])
    .execute();

  await sql`
      CREATE FUNCTION refresh_demande_intention_view() RETURNS trigger AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY "demandeIntentionView";
        RETURN NULL;
      END;
      $$ LANGUAGE 'plpgsql' SECURITY DEFINER;
    `.execute(db);

  await sql`
      CREATE TRIGGER update_intention_refresh_demande_intention_materialized_view_t
      AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("intention")}
          FOR EACH ROW EXECUTE PROCEDURE refresh_demande_intention_view();
    `.execute(db);

  await sql`
      CREATE TRIGGER update_demande_refresh_demande_intention_materialized_view_t
      AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("demande")}
          FOR EACH ROW EXECUTE PROCEDURE refresh_demande_intention_view();
    `.execute(db);

  await db.schema
    .createView("latestDemandeIntentionView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom((sq) =>
          // @ts-ignore
          sq
            .selectFrom("demandeIntentionView as demandeIntention" as never)
            // @ts-ignore
            .select([sql<number>`max("demandeIntention"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemandeIntention")
        )
        // @ts-ignore
        .leftJoin("demandeIntentionView as demandeIntention", (join) =>
          join
            .onRef("latestDemandeIntention.numero", "=", "demandeIntention.numero")
            .onRef("latestDemandeIntention.lastUpdatedAt", "=", "demandeIntention.updatedAt")
        )
        // @ts-ignore
        .selectAll("demandeIntention")
        // @ts-ignore
        .where("demandeIntention.statut", "!=", "deleted")
    )
    .materialized()
    .execute();

  await db.schema
    .createView("latestDemandeIntentionNonMaterializedView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
      // @ts-ignore
      db
        .selectFrom((sq) =>
          // @ts-ignore
          sq
            .selectFrom("demandeIntentionView as demandeIntention" as never)
            // @ts-ignore
            .select([sql<number>`max("demandeIntention"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemandeIntention")
        )
        // @ts-ignore
        .leftJoin("demandeIntentionView as demandeIntention", (join) =>
          join
            .onRef("latestDemandeIntention.numero", "=", "demandeIntention.numero")
            .onRef("latestDemandeIntention.lastUpdatedAt", "=", "demandeIntention.updatedAt")
        )
        // @ts-ignore
        .selectAll("demandeIntention")
        // @ts-ignore
        .where("demandeIntention.statut", "!=", "deleted")
    )
    .execute();

  await db.schema
    .createIndex("latestDemandeIntentionView_index")
    .unique()
    .on("latestDemandeIntentionView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createurId", "codeDispositif"])
    .execute();

  await sql`
    CREATE FUNCTION refresh_latest_demande_intention_view() RETURNS trigger AS $$
    BEGIN
      REFRESH MATERIALIZED VIEW CONCURRENTLY "latestDemandeIntentionView";
      RETURN NULL;
    END;
    $$ LANGUAGE 'plpgsql' SECURITY DEFINER;
  `.execute(db);

  await sql`
    CREATE TRIGGER update_intention_refresh_latest_demande_intention_materialized_view_t
    AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("intention")}
        FOR EACH ROW EXECUTE PROCEDURE refresh_latest_demande_intention_view();
  `.execute(db);

  await sql`
    CREATE TRIGGER update_demande_refresh_latest_demande_intention_materialized_view_t
    AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("demande")}
        FOR EACH ROW EXECUTE PROCEDURE refresh_latest_demande_intention_view();
  `.execute(db);
};

export const down = async (db: Kysely<unknown>) => {
  await sql`DROP TRIGGER update_demande_refresh_latest_demande_intention_materialized_view_t ON ${sql.table(
    "demande"
  )}`.execute(db);

  await sql`DROP TRIGGER update_intention_refresh_latest_demande_intention_materialized_view_t ON ${sql.table(
    "intention"
  )}`.execute(db);

  await sql`DROP FUNCTION refresh_latest_demande_intention_view()`.execute(db);

  await db.schema.dropIndex("latestDemandeIntentionView_index").ifExists().execute();

  await db.schema.dropView("latestDemandeIntentionView").materialized().ifExists().execute();
  await db.schema.dropView("latestDemandeIntentionNonMaterializedView").ifExists().execute();

  await sql`DROP TRIGGER update_demande_refresh_demande_intention_materialized_view_t ON ${sql.table(
    "demande"
  )}`.execute(db);

  await sql`DROP TRIGGER update_intention_refresh_demande_intention_materialized_view_t ON ${sql.table(
    "intention"
  )}`.execute(db);

  await sql`DROP FUNCTION refresh_demande_intention_view()`.execute(db);

  await db.schema.dropIndex("demandeIntentionView_index").ifExists().execute();

  await db.schema.dropView("demandeIntentionView").materialized().ifExists().execute();
  await db.schema.dropView("demandeIntentionNonMaterializedView").ifExists().execute();
};
