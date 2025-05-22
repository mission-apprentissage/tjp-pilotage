import { z } from "zod";

import { VoieZodType } from "../../enum/voieEnum";

export const EtablissementSchema = z.object({
  uai: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  commune: z.string(),
  libelleEtablissement: z.string(),
  libellesDispositifs: z.array(z.string()).transform((val) => val.filter(Boolean)),
  tauxInsertion: z.number().optional(),
  tauxDevenirFavorable: z.number().optional(),
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
  codeRegion: z.string().optional(),
  codeDepartement: z.string().optional(),
  codeAcademie: z.string().optional(),
  orderBy: z.enum(["libelle", "departement_commune"]).default("libelle"),
  voie: VoieZodType.optional(),
  includeAll: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional()
    .default("false"),
});

export type EtablissementsOrderBy = z.infer<typeof QueryFiltersSchema>["orderBy"];

export type QueryFilters = z.infer<typeof QueryFiltersSchema>;

export const ParamsSchema = z.object({
  cfd: z.string(),
});

export type Params = z.infer<typeof ParamsSchema>;

export const getFormationCfdMapSchema = {
  params: ParamsSchema,
  querystring: QueryFiltersSchema,
  response: {
    200: z.object({
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
