import { z } from "zod";

import { DemandeStatutZodType } from "../../enum/demandeStatutEnum";

const IntentionSchema = z.object({
  numero: z.string(),
});

const ChangementStatut = z.object({
  intentionNumero: z.string(),
  statutPrecedent: DemandeStatutZodType,
  statut: DemandeStatutZodType,
});

export const submitIntentionsStatutSchema = {
  body: z.object({
    intentions: z.array(IntentionSchema),
    statut: DemandeStatutZodType
  }),
  response: {
    200: z.object({
      changementsStatut: z.array(ChangementStatut)
    }),
  },
};
