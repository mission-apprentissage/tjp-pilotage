import type { Kysely } from "kysely";
import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const up = async (db: Kysely<unknown>) => {
  await db.schema.dropView("latestIntentionView").materialized().cascade().ifExists().execute();

  await db.schema.dropView("latestDemandeIntentionView").materialized().cascade().ifExists().execute();

  await db.schema.dropView("demandeIntentionView").materialized().cascade().ifExists().execute();

  await db.schema.dropView("latestIntentionNonMaterializedView").ifExists().execute();

  await db.schema.dropView("latestDemandeIntentionNonMaterializedView").ifExists().execute();

  await db.schema.alterTable("intention").addColumn("inspecteurReferent", "varchar").execute();

  await db.schema
    .createView("latestIntentionView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
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
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
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
    .createView("demandeIntentionView")
    .as(
      getKbdClient()
        // @ts-ignore
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
          // @ts-ignore
          getKbdClient()
            // @ts-ignore
            .selectFrom("demande")
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
    .unique()
    .on("latestDemandeIntentionView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createdBy", "codeDispositif"])
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropView("latestIntentionView").materialized().cascade().ifExists().execute();

  await db.schema.dropView("latestDemandeIntentionView").materialized().cascade().ifExists().execute();

  await db.schema.dropView("demandeIntentionView").materialized().cascade().ifExists().execute();

  await db.schema.dropView("latestIntentionNonMaterializedView").ifExists().execute();

  await db.schema.dropView("latestDemandeIntentionNonMaterializedView").ifExists().execute();

  await db.schema.alterTable("intention").dropColumn("inspecteurReferent").execute();

  await db.schema
    .createView("latestIntentionView")
    .as(
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
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
      // ts-ignore is mandatory here because we refresh views in this migration
      // types are not yet infered from kysely codegen
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
    .createView("demandeIntentionView")
    .as(
      getKbdClient()
        // @ts-ignore
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
          // @ts-ignore
          getKbdClient()
            // @ts-ignore
            .selectFrom("demande")
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
    .unique()
    .on("latestDemandeIntentionView")
    .columns(["id", "numero", "campagneId", "cfd", "uai", "codeRegion", "codeAcademie", "createdBy", "codeDispositif"])
    .execute();
};
