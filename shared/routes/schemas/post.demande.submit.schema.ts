import { z } from "zod";

import { DemandeStatutZodType } from "../../enum/demandeStatutEnum";
import { DemandeTypeZodType } from "../../enum/demandeTypeEnum";
import { unEscapeString } from "../../utils/escapeString";

export const submitDemandeSchema = {
  body: z.object({
    demande: z.object({
      uai: z.string(),
      cfd: z.string(),
      codeDispositif: z.string(),
      libelleFCIL: z.string().optional(),
      // Type de demande
      rentreeScolaire: z.coerce.number(),
      typeDemande: DemandeTypeZodType,
      coloration: z.boolean(),
      libelleColoration1: z.string().optional(),
      libelleColoration2: z.string().optional(),
      // Capacité
      mixte: z.boolean().optional(),
      capaciteScolaireActuelle: z.coerce.number().optional(),
      capaciteScolaire: z.coerce.number().optional(),
      capaciteScolaireColoreeActuelle: z.coerce.number().optional(),
      capaciteScolaireColoree: z.coerce.number().optional(),
      capaciteApprentissageActuelle: z.coerce.number().optional(),
      capaciteApprentissage: z.coerce.number().optional(),
      capaciteApprentissageColoreeActuelle: z.coerce.number().optional(),
      capaciteApprentissageColoree: z.coerce.number().optional(),
      // Précisions
      motif: z.array(z.string()).optional(),
      autreMotif: z
        .string()
        .optional()
        .transform((autreMotif) => unEscapeString(autreMotif)),
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
      inspecteurReferent: z.string().optional(),
      //RH
      recrutementRH: z.boolean().optional(),
      nbRecrutementRH: z.coerce.number().optional(),
      discipline1RecrutementRH: z.string().optional(),
      discipline2RecrutementRH: z.string().optional(),
      reconversionRH: z.boolean(),
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
      travauxAmenagementCout: z.coerce.number().optional(),
      travauxAmenagementDescription: z.string().optional(),
      achatEquipement: z.boolean().optional(),
      achatEquipementCout: z.coerce.number().optional(),
      achatEquipementDescription: z.string().optional(),
      // Internat et restauration
      augmentationCapaciteAccueilHebergement: z.boolean().optional(),
      augmentationCapaciteAccueilHebergementPlaces: z.coerce.number().optional(),
      augmentationCapaciteAccueilHebergementPrecisions: z.string().optional(),
      augmentationCapaciteAccueilRestauration: z.boolean().optional(),
      augmentationCapaciteAccueilRestaurationPlaces: z.coerce.number().optional(),
      augmentationCapaciteAccueilRestaurationPrecisions: z.string().optional(),
      // Observations / commentaires
      commentaire: z
        .string()
        .optional()
        .transform((commentaire) => unEscapeString(commentaire)),
      // Statut
      statut: DemandeStatutZodType.exclude(["supprimée"]),
      motifRefus: z.array(z.string()).optional(),
      autreMotifRefus: z
        .string()
        .optional()
        .transform((autreMotifRefus) => unEscapeString(autreMotifRefus)),
      // Autre
      numero: z.string().optional(),
      campagneId: z.string(),
    }),
  }),
  response: {
    200: z.object({
      id: z.string(),
      statut: DemandeStatutZodType,
      numero: z.string(),
    }),
  },
};
