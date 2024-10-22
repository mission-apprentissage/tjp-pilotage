import { OptionSchema } from "shared/schema/optionSchema";
import { z } from "zod";

const filtersSchema = z.object({
  regions: z.array(OptionSchema),
  academies: z.array(
    OptionSchema.extend({
      codeRegion: z.string(),
    })
  ),
  departements: z.array(
    OptionSchema.extend({
      codeRegion: z.string(),
      codeAcademie: z.string(),
    })
  ),
});

export const formationSchema = z.object({
  codeNsf: z.string(),
  cfd: z.string(),
  codeNiveauDiplome: z.string(),
  libelleFormation: z.string(),
  libelleNiveauDiplome: z.string(),
  typeFamille: z.string().optional(),
  nbEtab: z.number(),
  apprentissage: z.boolean(),
  scolaire: z.boolean(),
});

const queryFiltersSchema = z.object({
  codeRegion: z.string().optional(),
  codeAcademie: z.string().optional(),
  codeDepartement: z.string().optional(),
});

export type QueryFilters = z.infer<typeof queryFiltersSchema>;

export const getDomaineDeFormationSchema = {
  params: z.object({
    codeNsf: z.string(),
  }),
  querystring: queryFiltersSchema,
  response: {
    200: z.object({
      codeNsf: z.string(),
      libelleNsf: z.string(),
      filters: filtersSchema,
      formations: z.array(formationSchema),
    }),
  },
};
