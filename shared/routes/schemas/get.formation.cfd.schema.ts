import { z } from "zod";

const queryFiltersSchema = z.object({
  codeRegion: z.string().optional(),
  codeAcademie: z.string().optional(),
  codeDepartement: z.string().optional(),
});

export type QueryFilters = z.infer<typeof queryFiltersSchema>;

export const getFormationCfdSchema = {
  params: z.object({
    cfd: z.string(),
  }),
  querystring: queryFiltersSchema,
  response: {
    200: z.object({
      cfd: z.string(),
      libelle: z.string(),
      codeNiveauDiplome: z.string().optional(),
      typeFamille: z.string().optional(),
      codeNsf: z.string().optional(),
      libelleRome: z.string().optional(),
      isTransitionDemographique: z.boolean().optional(),
      isTransitionEcologique: z.boolean().optional(),
      isTransitionNumerique: z.boolean().optional(),
      isBTS: z.boolean(),
      isApprentissage: z.boolean(),
      isScolaire: z.boolean(),
      isInScope: z.boolean(),
      isFormationRenovee: z.boolean(),
    }),
  },
};
