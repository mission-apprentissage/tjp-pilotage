import { z } from "zod";

export const EtablissementSchema = z.object({
  uai: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  distance: z.number(),
  commune: z.string(),
  codeDepartement: z.string(),
  libelleEtablissement: z.string(),
  libelleDispositif: z.string(),
  voie: z.string(),
});

export const getDataForEtablissementMapSchema = {
  params: z.object({
    uai: z.string(),
  }),
  querystring: z.object({
    cfd: z.string().array().optional(),
    bbox: z
      .object({
        x1: z.string(),
        x2: z.string(),
        y1: z.string(),
        y2: z.string(),
      })
      .optional(),
  }),
  response: {
    200: EtablissementSchema.extend({
      initialZoom: z.number(),
      etablissementsProches: z.array(EtablissementSchema),
    }),
  },
};
