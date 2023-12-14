import { z } from "zod";

export const countDemandesSchema = {
  response: {
    200: z.object({
      total: z.number(),
      draft: z.number(),
      submitted: z.number(),
      refused: z.number(),
    }),
  },
};
