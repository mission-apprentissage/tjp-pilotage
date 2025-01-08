import { z } from "zod";

export const searchMetierSchema = {
  params: z.object({
    search: z.string(),
  }),
  querystring: z.object({
    codeDomaineProfessionnel: z.string().optional(),
  }),
  response: {
    200: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      }),
    ),
  },
};
