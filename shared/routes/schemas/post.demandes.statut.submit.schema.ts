import { z } from "zod";

import { DemandeStatutZodType } from "../../enum/demandeStatutEnum";

const DemandeSchema = z.object({
  numero: z.string(),
});

const ChangementStatut = z.object({
  demandeNumero: z.string(),
  statutPrecedent: DemandeStatutZodType,
  statut: DemandeStatutZodType,
});

export const submitDemandesStatutSchema = {
  body: z.object({
    demandes: z.array(DemandeSchema),
    statut: DemandeStatutZodType
  }),
  response: {
    200: z.object({
      changementsStatut: z.array(ChangementStatut)
    }),
  },
};
