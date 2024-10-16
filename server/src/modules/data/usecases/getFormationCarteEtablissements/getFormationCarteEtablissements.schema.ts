import { z } from "zod";

export const EtablissementSchema = z.object({
  uai: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  commune: z.string(),
  libelle: z.string(),
  libellesDispositifs: z
    .array(z.string())
    .transform((val) => val.filter(Boolean)),
  tauxEmploi: z.number().optional(),
  tauxDevenir: z.number().optional(),
  tauxPoursuite: z.number().optional(),
  tauxPression: z.number().optional(),
  effectifs: z.number().optional(),
  codeDepartement: z.string(),
  secteur: z.string(),
  isApprentissage: z.boolean(),
  isScolaire: z.boolean(),
  isBTS: z.boolean(),
});

export type Etablissement = z.infer<typeof EtablissementSchema>;

export const QueryFiltersSchema = z.object({
  cfd: z.string().array().optional(),
  bbox: z
    .object({
      latMin: z.number(),
      latMax: z.number(),
      lngMin: z.number(),
      lngMax: z.number(),
    })
    .optional(),
  mapHeight: z.coerce.number(),
  mapWidth: z.coerce.number(),
  codeRegion: z.string().optional(),
  codeDepartement: z.string().optional(),
  codeAcademie: z.string().optional(),
  orderBy: z.enum(["libelle", "departement_commune"]).default("libelle"),
});

export type EtablissementsOrderBy = z.infer<
  typeof QueryFiltersSchema
>["orderBy"];

export type QueryFilters = z.infer<typeof QueryFiltersSchema>;

export const ParamsSchema = z.object({
  cfd: z.string(),
});

export type Params = z.infer<typeof ParamsSchema>;

export const getFormationCarteEtablissementsSchema = {
  params: ParamsSchema,
  querystring: QueryFiltersSchema,
  response: {
    200: z.object({
      // center: z.object({
      //   lat: z.number(),
      //   lng: z.number(),
      // }),
      zoom: z.number(),
      etablissements: z.array(EtablissementSchema),
      bbox: z.object({
        latMin: z.number(),
        latMax: z.number(),
        lngMin: z.number(),
        lngMax: z.number(),
      }),
    }),
  },
};
