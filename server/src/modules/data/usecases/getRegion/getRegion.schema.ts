import { z } from "zod";
export const getRegionSchema = {
  params: z.object({
    codeRegion: z.string(),
  }),
  querystring: z.object({
    codeDiplome: z.array(z.string()).optional(),
  }),
  response: {
    200: z.object({
      libelleRegion: z.string(),
      effectif: z.coerce.number(),
      nbFormations: z.coerce.number(),
      tauxPression: z.coerce.number().optional(),
      tauxRemplissage: z.coerce.number().optional(),
      tauxPoursuiteEtudes: z.coerce.number().optional(),
      tauxInsertion6mois: z.coerce.number().optional(),
    }),
  },
};
