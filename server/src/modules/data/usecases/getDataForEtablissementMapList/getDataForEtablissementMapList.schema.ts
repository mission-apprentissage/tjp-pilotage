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
  effectif: z.number().optional(),
  tauxInsertion: z.number().optional(),
  tauxPoursuite: z.number().optional(),
  secteur: z.string().optional(),
});

export const getDataForEtablissementMapListSchema = {
  params: z.object({
    uai: z.string(),
  }),
  querystring: z.object({
    cfd: z.string().array().optional(),
    bbox: z.object({
      minLat: z.string(),
      maxLat: z.string(),
      minLng: z.string(),
      maxLng: z.string(),
    }),
  }),
  response: {
    200: z.object({
      count: z.number(),
      etablissement: z.optional(EtablissementSchema),
      etablissementsProches: z.array(EtablissementSchema),
    }),
  },
};
