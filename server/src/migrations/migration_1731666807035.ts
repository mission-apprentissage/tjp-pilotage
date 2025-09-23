import type { Kysely } from "kysely";
import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable("intention")
    .addColumn("capaciteScolaireColoreeActuelle", "integer", (c) => c.defaultTo(0))
    .addColumn("capaciteApprentissageColoreeActuelle", "integer", (c) => c.defaultTo(0))
    .execute();

  await db.schema
    .alterTable("demande")
    .addColumn("capaciteScolaireColoreeActuelle", "integer", (c) => c.defaultTo(0))
    .addColumn("capaciteApprentissageColoreeActuelle", "integer", (c) => c.defaultTo(0))
    .execute();

  await db.schema
    .alterTable("correction")
    .addColumn("capaciteScolaireColoreeActuelle", "integer", (c) => c.defaultTo(0))
    .addColumn("capaciteApprentissageColoreeActuelle", "integer", (c) => c.defaultTo(0))
    .execute();

  // regenerate views
  await db.schema.dropView("latestDemandeView").materialized().ifExists().execute();

  await db.schema.dropView("latestDemandeNonMaterializedView").ifExists().execute();

  await db.schema.dropView("demandeIntentionNonMaterializedView").ifExists().execute();

  await db.schema.dropView("demandeIntentionView").materialized().cascade().ifExists().execute();

  await db.schema.dropView("latestDemandeIntentionView").materialized().cascade().ifExists().execute();

  await db.schema.dropView("latestDemandeIntentionNonMaterializedView").ifExists().execute();

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
          // @ts-ignore
          getKbdClient()
            // @ts-ignore
            .selectFrom("demande")
            // @ts-ignore
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
          // @ts-ignore
          getKbdClient()
            // @ts-ignore
            .selectFrom("demande")
            // @ts-ignore
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
    .createIndex("demandeIntentionView_index")
    .unique()
    .on("demandeIntentionView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createdBy", "codeDispositif"])
    .execute();

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
            .select([sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemandes")
        )
        // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef("latestDemandes.lastUpdatedAt", "=", "demande.updatedAt")
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
    .orReplace()
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
            .select([sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemandes")
        )
        // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef("latestDemandes.lastUpdatedAt", "=", "demande.updatedAt")
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
        .where("demandeIntention.statut", "!=", "supprimée")
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
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropView("latestDemandeView").materialized().ifExists().execute();

  await db.schema.dropView("latestDemandeNonMaterializedView").ifExists().execute();

  await db.schema.dropView("demandeIntentionNonMaterializedView").ifExists().execute();

  await db.schema.dropView("demandeIntentionView").materialized().cascade().ifExists().execute();

  await db.schema.dropView("latestDemandeIntentionView").materialized().cascade().ifExists().execute();

  await db.schema.dropView("latestDemandeIntentionNonMaterializedView").ifExists().execute();

  await db.schema
    .alterTable("intention")
    .dropColumn("capaciteScolaireColoreeActuelle")
    .dropColumn("capaciteApprentissageColoreeActuelle")
    .execute();

  await db.schema
    .alterTable("demande")
    .dropColumn("capaciteScolaireColoreeActuelle")
    .dropColumn("capaciteApprentissageColoreeActuelle")
    .execute();

  await db.schema
    .alterTable("correction")
    .dropColumn("capaciteScolaireColoreeActuelle")
    .dropColumn("capaciteApprentissageColoreeActuelle")
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
          // @ts-ignore
          getKbdClient()
            // @ts-ignore
            .selectFrom("demande")
            // @ts-ignore
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
          // @ts-ignore
          getKbdClient()
            // @ts-ignore
            .selectFrom("demande")
            // @ts-ignore
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
    .createIndex("demandeIntentionView_index")
    .unique()
    .on("demandeIntentionView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createdBy", "codeDispositif"])
    .execute();

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
            .select([sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemandes")
        )
        // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef("latestDemandes.lastUpdatedAt", "=", "demande.updatedAt")
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
    .orReplace()
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
            .select([sql<number>`max("demande"."updatedAt")`.as("lastUpdatedAt"), "numero"])
            .distinct()
            .groupBy("numero")
            .as("latestDemandes")
        )
        // @ts-ignore
        .leftJoin("demande", (join) =>
          join
            .onRef("latestDemandes.numero", "=", "demande.numero")
            .onRef("latestDemandes.lastUpdatedAt", "=", "demande.updatedAt")
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
        .where("demandeIntention.statut", "!=", "supprimée")
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
};
