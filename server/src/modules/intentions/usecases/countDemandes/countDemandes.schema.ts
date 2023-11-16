import { z } from "zod";

export const countDemandesSchema = {
  response: {
    200: z.object({
      total: z.string(),
      draft: z.string(),
      submitted: z.string(),
    }),
  },
};
