import { z } from "zod";

export const searchNsfFormationSchema = {
  params: z.object({
    search: z.string(),
  }),
  querystring: z.object({
    codeNsf: z.string().optional(),
  }),
  response: {
    200: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
        data: z.object({
          voies: z.array(z.string()),
          dateFermeture: z.string().optional(),
        }),
      })
    ),
  },
};
