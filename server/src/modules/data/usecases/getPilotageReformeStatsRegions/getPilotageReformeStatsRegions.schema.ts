import { z } from "zod";

const OptionSchema = z.object({
  label: z.coerce.string(),
  value: z.coerce.string(),
});
const StatsRegionLineSchema = z.object({
  codeRegion: z.string(),
  libelleRegion: z.string().optional(),
  tauxChomage: z.coerce.number().optional(),
  tauxPoursuite: z.coerce.number().optional(),
  tauxInsertion: z.coerce.number().optional(),
  tauxTransformation: z.coerce.number().optional(),
});

const FiltersRegionsSchema = z.object({
  codeNiveauDiplome: z.array(z.string()).optional(),
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
    }),
  },
};
