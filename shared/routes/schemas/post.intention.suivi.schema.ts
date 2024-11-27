import { z } from "zod";

export const submitSuiviSchema = {
  body: z.object({
    intentionNumero: z.string(),
  }),
  response: {
    200: z.object({
      id: z.string(),
      intentionNumero: z.string(),
      userId: z.string(),
    }),
  },
};
