import { DemandeStatutZodType } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

const EtablissementMetadataSchema = z
  .object({
    libelleEtablissement: z.string().optional(),
    commune: z.string().optional(),
  })
  .optional();

const FormationMetadataSchema = z
  .object({
    libelleFormation: z.string().optional(),
    isFCIL: z.boolean().optional(),
    dispositifs: z
      .array(
        z.object({
          codeDispositif: z.string().optional(),
          libelleDispositif: z.string().optional(),
        })
      )
      .optional(),
  })
  .optional();

const MetadataSchema = z.object({
  etablissement: EtablissementMetadataSchema,
  formation: FormationMetadataSchema,
});

const IntentionSchema = z.object({
  uai: z.string(),
  cfd: z.string(),
  codeDispositif: z.string(),
  libelleFCIL: z.string().optional(),
  // Type de demande
  rentreeScolaire: z.coerce.number(),
  typeDemande: z.string(),
  coloration: z.boolean(),
  libelleColoration: z.string().optional(),
  // Capacité
  mixte: z.boolean().optional(),
  capaciteScolaireActuelle: z.coerce.number().optional(),
  capaciteScolaire: z.coerce.number().optional(),
  capaciteScolaireColoree: z.coerce.number().optional(),
  capaciteApprentissageActuelle: z.coerce.number().optional(),
  capaciteApprentissage: z.coerce.number().optional(),
  capaciteApprentissageColoree: z.coerce.number().optional(),
  // Précisions
  motif: z.array(z.string()),
  autreMotif: z.string().optional(),
  amiCma: z.boolean().optional(),
  amiCmaValide: z.boolean().optional(),
  amiCmaValideAnnee: z.string().optional(),
  amiCmaEnCoursValidation: z.boolean().optional(),
  partenairesEconomiquesImpliques: z.boolean().optional(),
  partenaireEconomique1: z.string().optional(),
  partenaireEconomique2: z.string().optional(),
  cmqImplique: z.boolean().optional(),
  filiereCmq: z.string().optional(),
  nomCmq: z.string().optional(),
  //RH
  recrutementRH: z.boolean().optional(),
  nbRecrutementRH: z.coerce.number().optional(),
  discipline1RecrutementRH: z.string().optional(),
  discipline2RecrutementRH: z.string().optional(),
  reconversionRH: z.boolean().optional(),
  nbReconversionRH: z.coerce.number().optional(),
  discipline1ReconversionRH: z.string().optional(),
  discipline2ReconversionRH: z.string().optional(),
  professeurAssocieRH: z.boolean().optional(),
  nbProfesseurAssocieRH: z.coerce.number().optional(),
  discipline1ProfesseurAssocieRH: z.string().optional(),
  discipline2ProfesseurAssocieRH: z.string().optional(),
  formationRH: z.boolean().optional(),
  nbFormationRH: z.coerce.number().optional(),
  discipline1FormationRH: z.string().optional(),
  discipline2FormationRH: z.string().optional(),
  besoinRHPrecisions: z.string().optional(),
  // Travaux et équipements
  travauxAmenagement: z.boolean().optional(),
  travauxAmenagementDescription: z.string().optional(),
  achatEquipement: z.boolean().optional(),
  achatEquipementDescription: z.string().optional(),
  // Internat et restauration
  augmentationCapaciteAccueilHebergement: z.boolean().optional(),
  augmentationCapaciteAccueilHebergementPlaces: z.coerce.number().optional(),
  augmentationCapaciteAccueilHebergementPrecisions: z.string().optional(),
  augmentationCapaciteAccueilRestauration: z.boolean().optional(),
  augmentationCapaciteAccueilRestaurationPlaces: z.coerce.number().optional(),
  augmentationCapaciteAccueilRestaurationPrecisions: z.string().optional(),
  // Observations / commentaires
  commentaire: z.string().optional(),
  // Statut
  statut: DemandeStatutZodType.exclude(["supprimée"]),
  commentaireStatut: z.string().optional(),
  motifRefus: z.array(z.string()).optional(),
  autreMotifRefus: z.string().optional(),
  // Autre
  numero: z.string(),
  createdAt: z.string(),
  campagneId: z.string(),
  campagne: z.object({
    id: z.string().optional(),
    annee: z.coerce.string().optional(),
    statut: z.string().optional(),
  }),
  changementsStatut: z.array(
    z.object({
      id: z.string(),
      intentionNumero: z.string(),
      userId: z.string(),
      userRole: z.string().optional(),
      statutPrecedent: DemandeStatutZodType.exclude(["supprimée"]).optional(),
      statut: DemandeStatutZodType.exclude(["supprimée"]),
      updatedAt: z.string(),
      userFullName: z.string(),
      commentaire: z.string().optional(),
    })
  ),
});

export const getIntentionSchema = {
  params: z.object({ numero: z.string() }),
  response: {
    200: IntentionSchema.partial().merge(
      z.object({
        metadata: MetadataSchema,
        canEdit: z.boolean(),
      })
    ),
  },
};
