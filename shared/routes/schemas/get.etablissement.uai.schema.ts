import { z } from "zod";

export const getEtablissementSchema = {
  params: z.object({
    uai: z.string(),
  }),
  response: {
    200: z.object({
      value: z.string(),
      label: z.string().optional(),
      commune: z.string().optional(),
    }),
  },
};
