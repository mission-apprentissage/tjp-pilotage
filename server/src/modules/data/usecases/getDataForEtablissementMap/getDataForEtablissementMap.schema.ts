import { z } from "zod";

export const EtablissementProcheSchema = z.object({
  uai: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  distance: z.number(),
});

export const getDataForEtablissementMapSchema = {
  params: z.object({
    uai: z.string(),
  }),
  querystring: z.object({
    cfd: z.string().array().optional(),
  }),
  response: {
    200: z.object({
      uai: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      etablissementsProches: z.array(EtablissementProcheSchema),
    }),
  },
};
