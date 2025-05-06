import { z } from "zod";

import { RaisonCorrectionZodType } from "../../enum/raisonCorrectionEnum";

const CorrectionSchema = z.object({
  demandeNumero: z.string(),
  capaciteScolaireActuelle: z.coerce.number(),
  capaciteScolaire: z.coerce.number(),
  capaciteScolaireColoreeActuelle: z.coerce.number(),
  capaciteScolaireColoree: z.coerce.number(),
  capaciteApprentissageActuelle: z.coerce.number(),
  capaciteApprentissage: z.coerce.number(),
  capaciteApprentissageColoreeActuelle: z.coerce.number(),
  capaciteApprentissageColoree: z.coerce.number(),
  motif: z.string(),
  autreMotif: z.string().optional(),
  raison: RaisonCorrectionZodType,
  commentaire: z.string().optional(),
});

export const submitCorrectionSchema = {
  body: z.object({ correction: CorrectionSchema }),
  response: {
    200: z.object({
      id: z.string(),
    }),
  },
};
