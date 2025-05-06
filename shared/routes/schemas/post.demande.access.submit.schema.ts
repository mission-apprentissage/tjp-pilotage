import { z } from "zod";

export const submitDemandeAccessLogSchema = {
  body: z.object({
    demande: z.object({
      numero: z.string(),
    }),
  }),
  response: {
    200: z.object({
      id: z.string(),
    }),
  },
};
