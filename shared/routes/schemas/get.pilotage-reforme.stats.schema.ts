import { z } from "zod";

import { OptionSchema } from "../../schema/optionSchema";

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
  codeNiveauDiplome: z.string().optional(),
  codeRegion: z.string().optional(),
});

const TauxTransformationSchema = z.object({
  placesTransformees: z.number().optional(),
  effectifs: z.number().optional(),
  taux: z.number().optional(),
});

export const getPilotageReformeStatsSchema = {
  querystring: FiltersSchema,
  response: {
    200: z.object({
      filters: z.object({
        regions: z.array(OptionSchema),
        diplomes: z.array(OptionSchema),
      }),
      annees: z.array(StatsAnneeSchema),
      tauxTransformationCumule: TauxTransformationSchema,
      tauxTransformationCumulePrevisionnel: TauxTransformationSchema,
    }),
  },
};
