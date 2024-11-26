import { z } from "zod";

import { DemandeStatutZodType } from "../../enum/demandeStatutEnum";
import { unEscapeString } from "../../utils/escapeString";

export const submitChangementStatutSchema = {
  body: z.object({
    changementStatut: z.object({
      intentionNumero: z.string(),
      statutPrecedent: DemandeStatutZodType.exclude(["supprimée"]).optional(),
      statut: DemandeStatutZodType.exclude(["supprimée"]),
      commentaire: z
        .string()
        .optional()
        .transform((commentaire) => unEscapeString(commentaire)),
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
