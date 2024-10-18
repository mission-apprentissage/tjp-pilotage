import { DemandeStatutZodType } from "shared/enum/demandeStatutEnum";
import { unEscapeString } from "shared/utils/escapeString";
import { z } from "zod";

export const submitDemandeSchema = {
  body: z.object({
    demande: z.object({
      numero: z.string().optional(),
      uai: z.string(),
      cfd: z.string(),
      codeDispositif: z.string(),
      libelleFCIL: z.string().optional(),
      rentreeScolaire: z.coerce.number(),
      typeDemande: z.string(),
      compensationUai: z.string().optional(),
      compensationCfd: z.string().optional(),
      compensationCodeDispositif: z.string().optional(),
      compensationRentreeScolaire: z.coerce.number().optional(),
      motif: z.array(z.string()).optional(),
      autreMotif: z
        .string()
        .optional()
        .transform((motif) => unEscapeString(motif)),
      libelleColoration: z.string().optional(),
      coloration: z.boolean(),
      amiCma: z.boolean().optional(),
      amiCmaValide: z.boolean().optional(),
      amiCmaValideAnnee: z.string().optional(),
      amiCmaEnCoursValidation: z.boolean().optional(),
      poursuitePedagogique: z.boolean().optional(),
      commentaire: z
        .string()
        .optional()
        .transform((commentaire) => unEscapeString(commentaire)),
      mixte: z.boolean().optional(),
      capaciteScolaireActuelle: z.coerce.number().optional(),
      capaciteScolaire: z.coerce.number().optional(),
      capaciteScolaireColoree: z.coerce.number().optional(),
      capaciteApprentissageActuelle: z.coerce.number().optional(),
      capaciteApprentissage: z.coerce.number().optional(),
      capaciteApprentissageColoree: z.coerce.number().optional(),
      statut: DemandeStatutZodType.exclude(["supprimée"]),
      motifRefus: z.array(z.string()).optional(),
      autreMotifRefus: z
        .string()
        .optional()
        .transform((motif) => unEscapeString(motif)),
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
      campagneId: z.string(),
    }),
  }),
  response: {
    200: z.object({
      id: z.string(),
      statut: DemandeStatutZodType,
    }),
  },
};
