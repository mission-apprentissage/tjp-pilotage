import { z } from "zod";

export const submitSuiviSchema = {
  body: z.object({
    demandeNumero: z.string(),
  }),
  response: {
    200: z.object({
      id: z.string(),
      demandeNumero: z.string(),
      userId: z.string(),
    }),
  },
};
