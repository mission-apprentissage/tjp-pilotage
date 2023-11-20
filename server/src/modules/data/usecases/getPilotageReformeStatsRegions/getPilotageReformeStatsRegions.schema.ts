import { z } from "zod";

const OptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});
const StatsRegionLineSchema = z.object({
  codeRegion: z.string(),
  libelleRegion: z.string().optional(),
  poursuite: z.coerce.number().optional(),
  insertion: z.coerce.number().optional(),
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
