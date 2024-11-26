import { z } from "zod";

const OptionSchema = z.object({
  label: z.coerce.string(),
  value: z.coerce.string(),
});

const StatsSchema = z.object({
  effectif: z.coerce.number().optional(),
  nbFormations: z.coerce.number().optional(),
  nbEtablissements: z.coerce.number().optional(),
  tauxPoursuite: z.coerce.number().optional(),
  tauxInsertion: z.coerce.number().optional(),
});

const StatsAnneeSchema = z.object({
  annee: z.number(),
  millesime: z.array(z.string()),
  nationale: StatsSchema,
  scoped: StatsSchema,
});

const FiltersSchema = z.object({
  codeNiveauDiplome: z.array(z.string()).optional(),
  codeRegion: z.string().optional(),
});

export const getPilotageReformeStatsSchema = {
  querystring: FiltersSchema,
  response: {
    200: z.object({
      filters: z.object({
        regions: z.array(OptionSchema),
        diplomes: z.array(OptionSchema),
      }),
      tauxTransformation: z.number(),
      annees: z.array(StatsAnneeSchema),
    }),
  },
};
