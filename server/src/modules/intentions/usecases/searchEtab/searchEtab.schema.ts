import { z } from "zod";

export const searchEtabSchema = {
  params: z.object({
    search: z.string(),
  }),
  response: {
    200: z.array(
      z.object({
        value: z.string(),
        label: z.string().optional(),
        commune: z.string().optional(),
      })
    ),
  },
};
