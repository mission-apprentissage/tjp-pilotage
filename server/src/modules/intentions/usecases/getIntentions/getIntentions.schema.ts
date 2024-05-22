import { DemandeStatutZodType } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

const UserSchema = z.object({
  fullname: z.string().optional(),
  id: z.string().optional(),
  role: z.string().optional(),
});

const IntentionsItem = z.object({
  // Formation
  libelleFormation: z.string().optional(),
  libelleEtablissement: z.string().optional(),
  codeDepartement: z.string().optional(),
  libelleDepartement: z.string().optional(),
  codeAcademie: z.string().optional(),
  libelleAcademie: z.string().optional(),
  codeRegion: z.string(),
  libelleRegion: z.string().optional(),
  libelleDispositif: z.string().optional(),
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
  statut: DemandeStatutZodType,
  motifRefus: z.array(z.string()).optional(),
  autreMotifRefus: z.string().optional(),
  // Autre
  numero: z.string(),
  userName: z.string().optional(),
  numeroDemandeImportee: z.string().optional(),
  updatedAt: z.string(),
  createdAt: z.string(),
  campagneId: z.string(),
  createdBy: UserSchema,
  updatedBy: UserSchema.optional(),
});

export const getIntentionsSchema = {
  querystring: z.object({
    statut: DemandeStatutZodType.exclude(["supprimée"]).optional(),
    search: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: IntentionsItem.keyof().optional(),
    offset: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    campagne: z.string().optional(),
  }),
  response: {
    200: z.object({
      count: z.coerce.number(),
      intentions: z.array(IntentionsItem),
      campagnes: z.array(
        z.object({
          annee: z.string(),
          statut: z.string(),
        })
      ),
      currentCampagne: z.object({
        annee: z.string(),
        statut: z.string(),
        id: z.string(),
      }),
      campagne: z.object({
        annee: z.string(),
        statut: z.string(),
        id: z.string(),
      }),
    }),
  },
};
