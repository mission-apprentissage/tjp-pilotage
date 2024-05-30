import { DemandeStatutZodType } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

export const submitChangementStatutSchema = {
  body: z.object({
    changementStatut: z.object({
      intentionNumero: z.string(),
      statutPrecedent: DemandeStatutZodType.exclude(["supprimée"]).optional(),
      statut: DemandeStatutZodType.exclude(["supprimée"]),
      commentaire: z.string().optional(),
    }),
  }),
  response: {
    200: z.object({
      id: z.string(),
      statutPrecedent: DemandeStatutZodType.optional(),
      statut: DemandeStatutZodType,
    }),
  },
};
