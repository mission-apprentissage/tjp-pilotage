
import { z } from "zod";



export const FiltersSchema = z.object({
  cfd: z.string(),
  codeDispositif: z.string(),
  uai: z.string(),
});

export const getCapacitePrecedenteSchema = {
  querystring: FiltersSchema,
  response: {
    200: z.object({
      capacite: z.coerce.number().optional(),
    }),
  },
};
