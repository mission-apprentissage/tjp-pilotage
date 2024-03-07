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
    200: z.object({
      uai: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      etablissementsProches: z.array(EtablissementProcheSchema),
    }),
  },
};
