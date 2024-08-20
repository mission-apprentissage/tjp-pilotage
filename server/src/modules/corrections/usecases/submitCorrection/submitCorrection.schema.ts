import { z } from "zod";

const CorrectionSchema = z.object({
  intentionNumero: z.string(),
  libelleColoration: z.string().optional(),
  coloration: z.boolean(),
  capaciteScolaireActuelle: z.coerce.number(),
  capaciteScolaire: z.coerce.number(),
  capaciteScolaireColoree: z.coerce.number(),
  capaciteApprentissageActuelle: z.coerce.number(),
  capaciteApprentissage: z.coerce.number(),
  capaciteApprentissageColoree: z.coerce.number(),
  motif: z.array(z.string()),
  autreMotif: z.string().optional(),
  raison: z.string(),
  commentaire: z.string().optional(),
  campagneId: z.string(),
});

export const submitCorrectionSchema = {
  body: z.object({ correction: CorrectionSchema }),
  response: {
    200: z.object({
      id: z.string(),
    }),
  },
};
