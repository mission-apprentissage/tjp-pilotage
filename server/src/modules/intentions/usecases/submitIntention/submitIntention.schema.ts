import { demandeStatut } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

export const submitIntentionSchema = {
  body: z.object({
    intention: z.object({
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
      amiCma: z.boolean(),
      amiCmaValide: z.boolean().optional(),
      amiCmaValideAnnee: z.string().optional(),
      amiCmaValideEnCours: z.boolean().optional(),
      partenairesEconomiquesImpliques: z.boolean().optional(),
      partenaireEconomique1: z.string().optional(),
      partenaireEconomique2: z.string().optional(),
      cmqImplique: z.boolean().optional(),
      filiereCmq: z.string().optional(),
      nomCmq: z.string().optional(),
      //RH
      recrutementRH: z.boolean(),
      nbRecrutementRH: z.coerce.number().optional(),
      discipline1RecrutementRH: z.string().optional(),
      discipline2RecrutementRH: z.string().optional(),
      reconversionRH: z.boolean(),
      nbReconversionRH: z.coerce.number().optional(),
      discipline1ReconversionRH: z.string().optional(),
      discipline2ReconversionRH: z.string().optional(),
      professeurAssocieRH: z.boolean(),
      nbProfesseurAssocieRH: z.coerce.number().optional(),
      discipline1ProfesseurAssocieRH: z.string().optional(),
      discipline2ProfesseurAssocieRH: z.string().optional(),
      formationRH: z.boolean(),
      nbFormationRH: z.coerce.number().optional(),
      discipline1FormationRH: z.string().optional(),
      discipline2FormationRH: z.string().optional(),
      besoinRHPrecisions: z.string().optional(),
      // Travaux et équipements
      travauxAmenagement: z.boolean(),
      travauxAmenagementDescription: z.string().optional(),
      travauxAmenagementParEtablissement: z.boolean().optional(),
      travauxAmenagementReseaux: z.boolean().optional(),
      travauxAmenagementReseauxDescription: z.string().optional(),
      achatEquipement: z.boolean(),
      achatEquipementDescription: z.string().optional(),
      coutEquipement: z.coerce.number().optional(),
      equipementPrecisions: z.string().optional(),
      // Internat et restauration
      augmentationCapaciteAccueilHebergement: z.boolean(),
      augmentationCapaciteAccueilHebergementPlaces: z.coerce
        .number()
        .optional(),
      augmentationCapaciteAccueilHebergementPrecisions: z.string().optional(),
      augmentationCapaciteAccueilRestauration: z.boolean(),
      augmentationCapaciteAccueilRestaurationPlaces: z.coerce
        .number()
        .optional(),
      augmentationCapaciteAccueilRestaurationPrecisions: z.string().optional(),
      // Observations / commentaires
      commentaire: z.string().optional(),
      // Statut
      statut: z.enum(["draft", "submitted", "refused"]),
      motifRefus: z.array(z.string()).optional(),
      autreMotifRefus: z.string().optional(),
      // Autre
      numero: z.string().optional(),
      campagneId: z.string(),
    }),
  }),
  response: {
    200: z.object({
      id: z.string(),
      statut: demandeStatut,
    }),
  },
};
