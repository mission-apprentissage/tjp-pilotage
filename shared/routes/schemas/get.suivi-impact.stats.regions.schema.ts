import { z } from "zod";


const TauxTransformationSchema = z.object({
  placesTransformees: z.number().optional(),
  effectifs: z.number().optional(),
  taux: z.number().optional(),
});

const StatsRegionLineSchema = z.object({
  codeRegion: z.string(),
  libelleRegion: z.string().optional(),
  tauxChomage: z.coerce.number().optional(),
  tauxPoursuite: z.coerce.number().optional(),
  tauxInsertion: z.coerce.number().optional(),
  tauxTransformationCumule: TauxTransformationSchema.optional(),
  tauxTransformationCumulePrevisionnel: TauxTransformationSchema.optional(),
});

export const FiltersRegionsSchema = z.object({
  codeNiveauDiplome: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: StatsRegionLineSchema.keyof().optional(),
});

export const getSuiviImpactStatsRegionsSchema = {
  querystring: FiltersRegionsSchema,
  response: {
    200: z.object({
      statsRegions: z.array(StatsRegionLineSchema),
      rentreesScolaire: z.array(z.string()),
    }),
  },
};
