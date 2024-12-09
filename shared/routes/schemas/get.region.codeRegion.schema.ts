import { z } from "zod";
export const getRegionSchema = {
  params: z.object({
    codeRegion: z.string(),
  }),
  querystring: z.object({
    codeNiveauDiplome: z.array(z.string()).optional(),
  }),
  response: {
    200: z.object({
      libelleRegion: z.string(),
      effectifEntree: z.coerce.number().optional(),
      effectifTotal: z.coerce.number().optional(),
      nbFormations: z.coerce.number().optional(),
      tauxPression: z.coerce.number().optional(),
      tauxRemplissage: z.coerce.number().optional(),
      tauxPoursuite: z.coerce.number().optional(),
      tauxInsertion: z.coerce.number().optional(),
      tauxDevenirFavorable: z.coerce.number().optional(),
    }),
  },
};
