import { z } from "zod";

import { OptionSchema } from "../../schema/optionSchema";

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

const FiltersRegionsSchema = z.object({
  codeNiveauDiplome: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: StatsRegionLineSchema.keyof().optional(),
});

export const getPilotageReformeStatsRegionsSchema = {
  querystring: FiltersRegionsSchema,
  response: {
    200: z.object({
      filters: z.object({
        diplomes: z.array(OptionSchema),
      }),
      statsRegions: z.array(StatsRegionLineSchema),
      rentreesScolaire: z.array(z.string()),
    }),
  },
};
