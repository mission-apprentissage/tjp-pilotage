import { z } from "zod";

export const countDemandesSchema = {
  querystring: z.object({
    campagne: z.string().optional(),
  }),
  response: {
    200: z.object({
      total: z.number(),
      draft: z.number(),
      submitted: z.number(),
      refused: z.number(),
    }),
  },
};
