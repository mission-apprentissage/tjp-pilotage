import type { Kysely} from 'kysely';
import {sql} from 'kysely';
import { chunk } from "lodash-es";

import {getKbdClient} from '@/db/db';
import { cleanNull } from '@/utils/noNull';

// **
// Migration dont l'objectif est de :
// - rassembler les demandes/intentions dans une seule table
// - de supprimer la notion d'intention
// - supprimer les vues d'agrégats demandeIntention / latestDemandeIntention etc...

export const up = async (db: Kysely<unknown>) => {
  await db.schema.dropView("demandeIntentionView").materialized().cascade().ifExists().execute();
  await db.schema.dropView("demandeIntentionNonMaterializedView").cascade().ifExists().execute();
  await db.schema.dropView("latestDemandeView").materialized().cascade().ifExists().execute();
  await db.schema.dropView("latestDemandeNonMaterializedView").cascade().ifExists().execute();
  await db.schema.dropView("latestIntentionView").materialized().cascade().ifExists().execute();
  await db.schema.dropView("latestIntentionNonMaterializedView").cascade().ifExists().execute();
  await db.schema.dropView("latestDemandeIntentionView").materialized().cascade().ifExists().execute();
  await db.schema.dropView("latestDemandeIntentionNonMaterializedView").cascade().ifExists().execute();

  await getKbdClient().executeQuery(
    sql`
      DROP INDEX IF EXISTS demandeIntentionView_index;
      DROP INDEX IF EXISTS latestDemandeView_index;
      DROP INDEX IF EXISTS latestIntentionView_index;
      DROP INDEX IF EXISTS latestDemandeIntentionView_index;

      DROP TRIGGER IF EXISTS update_demande_refresh_materialized_view_t ON ${sql.table("demande")} CASCADE;
      DROP TRIGGER IF EXISTS update_demande_refresh_demande_intention_materialized_view_t ON ${sql.table("demande")} CASCADE;
      DROP TRIGGER IF EXISTS update_demande_refresh_latest_demande_intention_materialized_view_t ON ${sql.table("demande")} CASCADE;
      DROP TRIGGER IF EXISTS update_intention_refresh_latest_demande_intention_materialized_view_t ON ${sql.table("intention")} CASCADE;
      DROP TRIGGER IF EXISTS update_intention_refresh_materialized_view_t ON ${sql.table("intention")} CASCADE;
      DROP TRIGGER IF EXISTS update_intention_refresh_demande_intention_materialized_view_t ON ${sql.table("intention")} CASCADE;

      DROP FUNCTION IF EXISTS refresh_demande_intention_view();
      DROP FUNCTION IF EXISTS refresh_latest_demande_view();
      DROP FUNCTION IF EXISTS refresh_latest_intention_view();
      DROP FUNCTION IF EXISTS refresh_latest_demande_intention_view();
    `.compile(getKbdClient())
  );

  await db.schema
    .alterTable("demande")
    .addColumn("partenairesEconomiquesImpliques", "boolean")
    .addColumn("partenaireEconomique1", "varchar")
    .addColumn("partenaireEconomique2", "varchar")
    .addColumn("cmqImplique", "boolean")
    .addColumn("filiereCmq", "varchar")
    .addColumn("nomCmq", "varchar")
    .addColumn("besoinRHPrecisions", "varchar")
    .addColumn("travauxAmenagement", "boolean")
    .addColumn("travauxAmenagementDescription", "varchar")
    .addColumn("achatEquipement", "boolean")
    .addColumn("achatEquipementDescription", "varchar")
    .addColumn("augmentationCapaciteAccueilHebergement", "boolean")
    .addColumn("augmentationCapaciteAccueilHebergementPlaces", "integer")
    .addColumn("augmentationCapaciteAccueilHebergementPrecisions", "varchar")
    .addColumn("augmentationCapaciteAccueilRestauration", "boolean")
    .addColumn("augmentationCapaciteAccueilRestaurationPlaces", "integer")
    .addColumn("augmentationCapaciteAccueilRestaurationPrecisions", "varchar")
    .addColumn("inspecteurReferent", "varchar")
    .addColumn("achatEquipementCout", "integer")
    .addColumn("travauxAmenagementCout", "integer")
    .addColumn("isOldDemande", "boolean", (c) => c.notNull().defaultTo(true))
    .execute();

  const intentions = await getKbdClient()
    // @ts-ignore
    .selectFrom("intention")
    .selectAll()
    .execute()
    .then((intentions) => intentions.map((intention) => cleanNull({
      ...intention,
      isOldDemande: false
    })));

  let countIntentions = 0;
  chunk(intentions, 500).forEach(async (intentionsChunk) =>
    getKbdClient()
      .transaction()
      .execute((transaction) =>
        transaction
          .insertInto("demande")
          // @ts-ignore
          .values(intentionsChunk)
          .execute()
          .then(() => {
            countIntentions += intentionsChunk.length;
            console.log(`\rIntentions -> demandes migrées : ${countIntentions}`);
          })
      )
  );

  await db.schema
    .createView("latestDemandeView")
    .as(
      // @ts-ignore
      db
        .selectFrom((sq) =>
          // @ts-ignore
          sq
            .selectFrom("demande" as never)
            // @ts-ignore
            .select([sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemande")
        )
        // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemande.numero", "=", "demande.numero")
            .onRef("latestDemande.lastUpdatedAt", "=", "demande.updatedAt")
        )
        // @ts-ignore
        .selectAll("demande")
        // @ts-ignore
        .where("demande.statut", "!=", "supprimée")
    )
    .materialized()
    .execute();

  await db.schema
    .createView("latestDemandeNonMaterializedView")
    .as(
      // @ts-ignore
      db
        .selectFrom((sq) =>
        // @ts-ignore
          sq
            .selectFrom("demande" as never)
          // @ts-ignore
            .select([sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemande")
        )
      // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemande.numero", "=", "demande.numero")
            .onRef("latestDemande.lastUpdatedAt", "=", "demande.updatedAt")
        )
      // @ts-ignore
        .selectAll("demande")
      // @ts-ignore
        .where("demande.statut", "!=", "supprimée")
    )
    .execute();

  await db.schema
    .createIndex("latestDemandeView_index")
    .ifNotExists()
    .unique()
    .on("latestDemandeView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createdBy", "codeDispositif"])
    .execute();

  getKbdClient().transaction().execute(async (transaction) => transaction.executeQuery(
    sql`
      CREATE OR REPLACE FUNCTION refresh_latest_demande_view() RETURNS trigger AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY "latestDemandeView";
        RETURN NULL;
      END;
      $$ LANGUAGE 'plpgsql' SECURITY DEFINER;

      CREATE OR REPLACE TRIGGER update_demande_refresh_materialized_view_t
      AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("demande")}
          FOR EACH ROW EXECUTE PROCEDURE refresh_latest_demande_view();
    `.compile(getKbdClient())
  ));

  await db.schema.alterTable("avis").renameColumn("intentionNumero", "demandeNumero").execute();
  await db.schema.alterTable("changementStatut").renameColumn("intentionNumero", "demandeNumero").execute();
  await db.schema.alterTable("suivi").renameColumn("intentionNumero", "demandeNumero").execute();
  await db.schema.alterTable("intentionAccessLog").renameColumn("intentionNumero", "demandeNumero").execute();
  await db.schema.alterTable("correction").renameColumn("intentionNumero", "demandeNumero").execute();

  await db.schema.dropTable("intention").cascade().ifExists().execute();
};

export const down = async (db: Kysely<unknown>) => {

  await getKbdClient().executeQuery(
    sql`
      DROP INDEX IF EXISTS latestDemandeView_index;
      DROP TRIGGER IF EXISTS update_demande_refresh_materialized_view_t ON ${sql.table("demande")} CASCADE;
      DROP FUNCTION IF EXISTS refresh_latest_demande_view() CASCADE;
    `.compile(getKbdClient())
  );

  await db.schema.dropView("latestDemandeView").materialized().cascade().ifExists().execute();
  await db.schema.dropView("latestDemandeNonMaterializedView").cascade().ifExists().execute();

  await getKbdClient()
    .transaction()
    .execute((transaction) =>  transaction.schema
      .createTable("intention")
      .addColumn("id", "uuid", (c) => c.primaryKey().defaultTo(db.fn("uuid_generate_v4")))
      .addColumn("numero", "varchar", (c) => c.notNull())
      .addColumn("cfd", "varchar")
      .addColumn("codeDispositif", "varchar")
      .addColumn("uai", "varchar")
      .addColumn("rentreeScolaire", "integer")
      .addColumn("statut", "varchar")
      .addColumn("typeDemande", "varchar")
      .addColumn("motif", sql`varchar[]`)
      .addColumn("autreMotif", "varchar")
      .addColumn("coloration", "boolean")
      .addColumn("libelleColoration", "varchar")
      .addColumn("amiCma", "boolean")
      .addColumn("commentaire", "varchar")
      .addColumn("codeRegion", "varchar(2)", (c) => c.references("region.codeRegion"))
      .addColumn("codeAcademie", "varchar(2)", (c) => c.references("academie.codeAcademie"))
      .addColumn("capaciteScolaire", "integer")
      .addColumn("capaciteScolaireActuelle", "integer")
      .addColumn("capaciteScolaireColoree", "integer")
      .addColumn("capaciteScolaireColoreeActuelle", "integer")
      .addColumn("capaciteApprentissage", "integer")
      .addColumn("capaciteApprentissageActuelle", "integer")
      .addColumn("capaciteApprentissageColoree", "integer")
      .addColumn("capaciteApprentissageColoreeActuelle", "integer")
      .addColumn("mixte", "boolean")
      .addColumn("libelleFCIL", "varchar")
      .addColumn("motifRefus", sql`varchar[]`)
      .addColumn("autreMotifRefus", "varchar")
      .addColumn("campagneId", "uuid")
      .addColumn("numeroHistorique", "varchar")
      .addColumn("amiCmaValide", "boolean")
      .addColumn("amiCmaValideAnnee", "varchar")
      .addColumn("amiCmaEnCoursValidation", "boolean")
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
      .addColumn("partenairesEconomiquesImpliques", "boolean")
      .addColumn("partenaireEconomique1", "varchar")
      .addColumn("partenaireEconomique2", "varchar")
      .addColumn("cmqImplique", "boolean")
      .addColumn("filiereCmq", "varchar")
      .addColumn("nomCmq", "varchar")
      .addColumn("besoinRHPrecisions", "varchar")
      .addColumn("travauxAmenagement", "boolean")
      .addColumn("travauxAmenagementDescription", "varchar")
      .addColumn("achatEquipement", "boolean")
      .addColumn("achatEquipementDescription", "varchar")
      .addColumn("augmentationCapaciteAccueilHebergement", "boolean")
      .addColumn("augmentationCapaciteAccueilHebergementPlaces", "integer")
      .addColumn("augmentationCapaciteAccueilHebergementPrecisions", "varchar")
      .addColumn("augmentationCapaciteAccueilRestauration", "boolean")
      .addColumn("augmentationCapaciteAccueilRestaurationPlaces", "integer")
      .addColumn("augmentationCapaciteAccueilRestaurationPrecisions", "varchar")
      .addColumn("inspecteurReferent", "varchar")
      .addColumn("achatEquipementCout", "integer")
      .addColumn("travauxAmenagementCout", "integer")
      .addColumn("createdBy", "uuid", (c) => c.references("user.id"))
      .addColumn("createdAt", "timestamptz", (c) => c.defaultTo(sql`NOW()`))
      .addColumn("updatedBy", "uuid", (c) => c.references("user.id"))
      .addColumn("updatedAt", "timestamptz", (c) => c.defaultTo(sql`NOW()`))
      .execute()
    );

  await db.schema.alterTable("avis").renameColumn("demandeNumero", "intentionNumero").execute();
  await db.schema.alterTable("changementStatut").renameColumn("demandeNumero", "intentionNumero").execute();
  await db.schema.alterTable("suivi").renameColumn("demandeNumero", "intentionNumero").execute();
  await db.schema.alterTable("intentionAccessLog").renameColumn("demandeNumero", "intentionNumero").execute();
  await db.schema.alterTable("correction").renameColumn("demandeNumero", "intentionNumero").execute();

  const intentions = await getKbdClient()
    .selectFrom("demande")
    // @ts-ignore
    .where("demande.isOldDemande", "=", false)
    .selectAll()
    .execute()
    .then((intentions) => intentions.map(({
      // @ts-ignore
      // eslint-disable-next-line unused-imports/no-unused-vars, max-len
      isOldDemande, poursuitePedagogique, poursuitepedagogique, compensationCfd, compensationcfd, compensationCodeDispositif, compensationcodedispositif, compensationUai, compensationuai, compensationrentreescolaire, compensationRentreeScolaire, autreBesoinRH, autrebesoinrh,
      ...rest
    }) => rest));

  let countIntentions = 0;
  chunk(intentions, 500).forEach(async (intentionsChunk) =>
    getKbdClient()
      .transaction()
      .execute((transaction) =>
        transaction
        // @ts-ignore
          .insertInto("intention")
        // @ts-ignore
          .values(intentionsChunk)
          .onConflict((oc) => oc.doNothing())
          .execute()
          .then(() => {
            countIntentions += intentionsChunk.length;
            console.log(`\rDemandes -> intentions migrées : ${countIntentions}`);
          })
      )
  );

  await getKbdClient()
    .deleteFrom("demande")
    // @ts-ignore
    .where("demande.isOldDemande", "=", false)
    .execute();

  await db.schema
    .alterTable("demande")
    .dropColumn("isOldDemande")
    .dropColumn("partenairesEconomiquesImpliques")
    .dropColumn("partenaireEconomique1")
    .dropColumn("partenaireEconomique2")
    .dropColumn("cmqImplique")
    .dropColumn("filiereCmq")
    .dropColumn("nomCmq")
    .dropColumn("besoinRHPrecisions")
    .dropColumn("travauxAmenagement")
    .dropColumn("travauxAmenagementDescription")
    .dropColumn("achatEquipement")
    .dropColumn("achatEquipementDescription")
    .dropColumn("augmentationCapaciteAccueilHebergement")
    .dropColumn("augmentationCapaciteAccueilHebergementPlaces")
    .dropColumn("augmentationCapaciteAccueilHebergementPrecisions")
    .dropColumn("augmentationCapaciteAccueilRestauration")
    .dropColumn("augmentationCapaciteAccueilRestaurationPlaces")
    .dropColumn("augmentationCapaciteAccueilRestaurationPrecisions")
    .dropColumn("inspecteurReferent")
    .dropColumn("achatEquipementCout")
    .dropColumn("travauxAmenagementCout")
    .execute();

  await db.schema
    .createView("demandeIntentionView")
    .as(
      getKbdClient()
      // @ts-ignore
        .selectFrom("intention")
      // @ts-ignore
        .select([
          sql<boolean>`true`.as("isIntention"),
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
          "createdBy",
          "updatedBy",
          "createdAt",
          "capaciteScolaire",
          "capaciteScolaireActuelle",
          "capaciteScolaireColoree",
          "capaciteScolaireColoreeActuelle",
          "capaciteApprentissage",
          "capaciteApprentissageActuelle",
          "capaciteApprentissageColoree",
          "capaciteApprentissageColoreeActuelle",
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
          "inspecteurReferent",
          "besoinRHPrecisions",
          "travauxAmenagement",
          "travauxAmenagementDescription",
          "travauxAmenagementCout",
          "achatEquipement",
          "achatEquipementDescription",
          "achatEquipementCout",
          "augmentationCapaciteAccueilHebergement",
          "augmentationCapaciteAccueilHebergementPlaces",
          "augmentationCapaciteAccueilHebergementPrecisions",
          "augmentationCapaciteAccueilRestauration",
          "augmentationCapaciteAccueilRestaurationPlaces",
          "augmentationCapaciteAccueilRestaurationPrecisions",
        ])
        .union(
          getKbdClient()
            .selectFrom("demande")
            .select([
              sql<boolean>`false`.as("isIntention"),
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
              "createdBy",
              "updatedBy",
              "createdAt",
              "capaciteScolaire",
              "capaciteScolaireActuelle",
              "capaciteScolaireColoree",
              "capaciteScolaireColoreeActuelle",
              "capaciteApprentissage",
              "capaciteApprentissageActuelle",
              "capaciteApprentissageColoree",
              "capaciteApprentissageColoreeActuelle",
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
              sql<string>`null`.as("inspecteurReferent"),
              sql<string>`null`.as("besoinRHPrecisions"),
              sql<boolean>`null`.as("travauxAmenagement"),
              sql<string>`null`.as("travauxAmenagementDescription"),
              sql<number>`null`.as("travauxAmenagementCout"),
              sql<boolean>`null`.as("achatEquipement"),
              sql<string>`null`.as("achatEquipementDescription"),
              sql<number>`null`.as("achatEquipementCout"),
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
    .createView("demandeIntentionNonMaterializedView")
    .as(
      getKbdClient()
        // @ts-ignore
        .selectFrom("intention")
        // @ts-ignore
        .select([
          sql<boolean>`true`.as("isIntention"),
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
          "createdBy",
          "updatedBy",
          "createdAt",
          "capaciteScolaire",
          "capaciteScolaireActuelle",
          "capaciteScolaireColoree",
          "capaciteScolaireColoreeActuelle",
          "capaciteApprentissage",
          "capaciteApprentissageActuelle",
          "capaciteApprentissageColoree",
          "capaciteApprentissageColoreeActuelle",
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
          "inspecteurReferent",
          "besoinRHPrecisions",
          "travauxAmenagement",
          "travauxAmenagementDescription",
          "travauxAmenagementCout",
          "achatEquipement",
          "achatEquipementDescription",
          "achatEquipementCout",
          "augmentationCapaciteAccueilHebergement",
          "augmentationCapaciteAccueilHebergementPlaces",
          "augmentationCapaciteAccueilHebergementPrecisions",
          "augmentationCapaciteAccueilRestauration",
          "augmentationCapaciteAccueilRestaurationPlaces",
          "augmentationCapaciteAccueilRestaurationPrecisions",
        ])
        .union(
          getKbdClient()
            .selectFrom("demande")
            .select([
              sql<boolean>`false`.as("isIntention"),
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
              "createdBy",
              "updatedBy",
              "createdAt",
              "capaciteScolaire",
              "capaciteScolaireActuelle",
              "capaciteScolaireColoree",
              "capaciteScolaireColoreeActuelle",
              "capaciteApprentissage",
              "capaciteApprentissageActuelle",
              "capaciteApprentissageColoree",
              "capaciteApprentissageColoreeActuelle",
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
              sql<string>`null`.as("inspecteurReferent"),
              sql<string>`null`.as("besoinRHPrecisions"),
              sql<boolean>`null`.as("travauxAmenagement"),
              sql<string>`null`.as("travauxAmenagementDescription"),
              sql<number>`null`.as("travauxAmenagementCout"),
              sql<boolean>`null`.as("achatEquipement"),
              sql<string>`null`.as("achatEquipementDescription"),
              sql<number>`null`.as("achatEquipementCout"),
              sql<boolean>`null`.as("augmentationCapaciteAccueilHebergement"),
              sql<number>`null`.as("augmentationCapaciteAccueilHebergementPlaces"),
              sql<string>`null`.as("augmentationCapaciteAccueilHebergementPrecisions"),
              sql<boolean>`null`.as("augmentationCapaciteAccueilRestauration"),
              sql<number>`null`.as("augmentationCapaciteAccueilRestaurationPlaces"),
              sql<string>`null`.as("augmentationCapaciteAccueilRestaurationPrecisions"),
            ])
        )
    )
    .execute();

  await db.schema
    .createIndex("demandeIntentionView_index")
    .unique()
    .on("demandeIntentionView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createdBy", "codeDispositif"])
    .execute();


  await db.schema
    .createView("latestDemandeView")
    .as(
      // @ts-ignore
      db
        .selectFrom((sq) =>
          // @ts-ignore
          sq            .selectFrom("demande" as never)
            // @ts-ignore
            .select([sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemande")
        )
        // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemande.numero", "=", "demande.numero")
            .onRef("latestDemande.lastUpdatedAt", "=", "demande.updatedAt")
        )
        // @ts-ignore
        .selectAll("demande")
        // @ts-ignore
        .where("demande.statut", "!=", "supprimée")
    )
    .materialized()
    .execute();

  await db.schema
    .createView("latestDemandeNonMaterializedView")
    .as(
      // @ts-ignore
      db
        .selectFrom((sq) =>
          // @ts-ignore
          sq
            .selectFrom("demande" as never)
            // @ts-ignore
            .select([sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemande")
        )
        // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemande.numero", "=", "demande.numero")
            .onRef("latestDemande.lastUpdatedAt", "=", "demande.updatedAt")
        )
        // @ts-ignore
        .selectAll("demande")
        // @ts-ignore
        .where("demande.statut", "!=", "supprimée")
    )
    .execute();

  await db.schema
    .createIndex("latestDemandeView_index")
    .unique()
    .on("latestDemandeView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createdBy", "codeDispositif"])
    .execute();

  await db.schema
    .createView("latestIntentionView")
    .as(
      // @ts-ignore
      db
        .selectFrom((sq) =>
        // @ts-ignore
          sq
            .selectFrom("intention" as never)
          // @ts-ignore
            .select([sql<number>`max("intention"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestIntention")
        )
      // @ts-ignore
        .leftJoin("intention", (join) =>
          join
            .onRef("latestIntention.numero", "=", "intention.numero")
            .onRef("latestIntention.lastUpdatedAt", "=", "intention.updatedAt")
        )
      // @ts-ignore
        .selectAll("intention")
      // @ts-ignore
        .where("intention.statut", "!=", "supprimée")
    )
    .materialized()
    .execute();

  await db.schema
    .createView("latestIntentionNonMaterializedView")
    .as(
      // @ts-ignore
      db
        .selectFrom((sq) =>
        // @ts-ignore
          sq
            .selectFrom("intention" as never)
          // @ts-ignore
            .select([sql<number>`max("intention"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestIntention")
        )
      // @ts-ignore
        .leftJoin("intention", (join) =>
          join
            .onRef("latestIntention.numero", "=", "intention.numero")
            .onRef("latestIntention.lastUpdatedAt", "=", "intention.updatedAt")
        )
      // @ts-ignore
        .selectAll("intention")
      // @ts-ignore
        .where("intention.statut", "!=", "supprimée")
    )
    .execute();

  await db.schema
    .createIndex("latestIntentionView_index")
    .unique()
    .on("latestIntentionView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createdBy", "codeDispositif"])
    .execute();

  await db.schema
    .createView("latestDemandeIntentionView")
    .as(
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
        .where("demandeIntention.statut", "!=", "supprimée")
    )
    .materialized()
    .execute();

  await db.schema
    .createView("latestDemandeIntentionNonMaterializedView")
    .as(
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
        .where("demandeIntention.statut", "!=", "supprimée")
    )
    .execute();

  await db.schema
    .createIndex("latestDemandeIntentionView_index")
    .ifNotExists()
    .unique()
    .on("latestDemandeIntentionView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createdBy", "codeDispositif"])
    .execute();

  await sql`
      CREATE OR REPLACE FUNCTION refresh_demande_intention_view() RETURNS trigger AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY "demandeIntentionView";
        RETURN NULL;
      END;
      $$ LANGUAGE 'plpgsql' SECURITY DEFINER;
    `.execute(db);

  await sql`
      CREATE OR REPLACE FUNCTION refresh_latest_demande_view() RETURNS trigger AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY "latestDemandeView";
        RETURN NULL;
      END;
      $$ LANGUAGE 'plpgsql' SECURITY DEFINER;
    `.execute(db);

  await sql`
      CREATE OR REPLACE FUNCTION refresh_latest_intention_view() RETURNS trigger AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY "latestIntentionView";
        RETURN NULL;
      END;
      $$ LANGUAGE 'plpgsql' SECURITY DEFINER;
    `.execute(db);

  await sql`
      CREATE OR REPLACE FUNCTION refresh_latest_demande_intention_view() RETURNS trigger AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY "latestDemandeIntentionView";
        RETURN NULL;
      END;
      $$ LANGUAGE 'plpgsql' SECURITY DEFINER;
    `.execute(db);

  await sql`
    CREATE OR REPLACE TRIGGER update_demande_refresh_demande_intention_materialized_view_t
    AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("demande")}
        FOR EACH ROW EXECUTE PROCEDURE refresh_demande_intention_view();
    `.execute(db);

  await sql`
    CREATE OR REPLACE TRIGGER update_intention_refresh_demande_intention_materialized_view_t
    AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("intention")}
        FOR EACH ROW EXECUTE PROCEDURE refresh_demande_intention_view();
  `.execute(db);

  await sql`
    CREATE OR REPLACE TRIGGER update_demande_refresh_materialized_view_t
    AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("demande")}
        FOR EACH ROW EXECUTE PROCEDURE refresh_latest_demande_view();
  `.execute(db);

  await sql`
    CREATE OR REPLACE TRIGGER update_intention_refresh_materialized_view_t
    AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("intention")}
        FOR EACH ROW EXECUTE PROCEDURE refresh_latest_intention_view();
    `.execute(db);

  await sql`
    CREATE OR REPLACE TRIGGER update_intention_refresh_latest_demande_intention_materialized_view_t
    AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("intention")}
        FOR EACH ROW EXECUTE PROCEDURE refresh_latest_demande_intention_view();
    `.execute(db);

  await sql`
    CREATE OR REPLACE TRIGGER update_demande_refresh_latest_demande_intention_materialized_view_t
    AFTER INSERT OR UPDATE OR DELETE ON ${sql.table("demande")}
        FOR EACH ROW EXECUTE PROCEDURE refresh_latest_demande_intention_view();
    `.execute(db);
};
