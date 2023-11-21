import { z } from "zod";
export const getDepartementSchema = {
  params: z.object({
    codeDepartement: z.string(),
  }),
  querystring: z.object({
    codeNiveauDiplome: z.array(z.string()).optional(),
  }),
  response: {
    200: z.object({
      codeRegion: z.string(),
      libelleDepartement: z.string(),
      effectif: z.coerce.number().optional(),
      nbFormations: z.coerce.number().optional(),
      tauxPression: z.coerce.number().optional(),
      tauxRemplissage: z.coerce.number().optional(),
      tauxPoursuite: z.coerce.number().optional(),
      tauxInsertion: z.coerce.number().optional(),
    }),
  },
};
