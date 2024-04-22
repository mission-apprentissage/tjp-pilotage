import { z } from "zod";

export const searchEtablissementPerdirSchema = {
  params: z.object({
    search: z.string().optional(),
  }),
  querystring: z.object({
    filtered: z.coerce.boolean().optional(),
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
