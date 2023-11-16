import { z } from "zod";
export const getDepartementSchema = {
  params: z.object({
    codeDepartement: z.string(),
  }),
  querystring: z.object({
    codeDiplome: z.array(z.string()).optional(),
  }),
  response: {
    200: z.object({
      codeRegion: z.string(),
      libelleDepartement: z.string(),
      effectif: z.coerce.number(),
      nbFormations: z.coerce.number(),
      tauxPression: z.coerce.number().optional(),
      tauxRemplissage: z.coerce.number().optional(),
      tauxPoursuiteEtudes: z.coerce.number().optional(),
      tauxInsertion6mois: z.coerce.number().optional(),
    }),
  },
};
