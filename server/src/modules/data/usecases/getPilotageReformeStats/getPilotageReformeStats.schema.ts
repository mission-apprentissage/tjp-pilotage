import { z } from "zod";

const OptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const StatsSchema = z.object({
  effectif: z.number().optional(),
  nbFormations: z.number().optional(),
  nbEtablissements: z.number().optional(),
  poursuite: z.number().optional(),
  insertion: z.number().optional(),
});

const StatsAnneeSchema = z.object({
  nationale: StatsSchema,
  filtered: StatsSchema,
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
      anneeN: StatsAnneeSchema,
      anneeNMoins1: StatsAnneeSchema,
    }),
  },
};
