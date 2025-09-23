import { z } from "zod";

export const searchEtablissementSchema = {
  params: z.object({
    search: z.string(),
  }),
  querystring: z.object({
    filtered: z.coerce.boolean().optional(),
    isFormulaire: z.coerce.boolean().optional(),
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
