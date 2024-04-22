import { z } from "zod";

export const countIntentionsSchema = {
  querystring: z.object({
    anneeCampagne: z.string().optional(),
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
