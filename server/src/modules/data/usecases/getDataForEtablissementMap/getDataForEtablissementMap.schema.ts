import { z } from "zod";

export const EtablissementSchema = z.object({
  uai: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  distance: z.number(),
  commune: z.string(),
  codeDepartement: z.string(),
  libelleEtablissement: z.string(),
  libellesDispositifs: z.array(z.string()),
  voies: z.array(z.string()),
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
    mapHeight: z.coerce.number(),
    mapWidth: z.coerce.number(),
  }),
  response: {
    200: z.object({
      center: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      initialZoom: z.number(),
      etablissement: z.optional(EtablissementSchema),
      etablissementsProches: z.array(EtablissementSchema),
    }),
  },
};
