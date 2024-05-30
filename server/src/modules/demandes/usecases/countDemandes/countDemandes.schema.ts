import { z } from "zod";

export const countDemandesSchema = {
  querystring: z.object({
    anneeCampagne: z.string().optional(),
  }),
  response: {
    200: z.object({
      total: z.number(),
      ["projet de demande"]: z.number(),
      ["demande validée"]: z.number(),
      ["refusée"]: z.number(),
    }),
  },
};
