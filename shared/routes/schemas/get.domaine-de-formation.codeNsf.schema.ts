import { z } from "zod";

import { TypeFamilleZodType } from "../../enum/typeFamilleEnum";
import { VoieZodType} from '../../enum/voieEnum';
import { OptionSchema } from "../../schema/optionSchema";

const FiltersSchema = z.object({
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

export const FormationSchema = z.object({
  codeNsf: z.string(),
  cfd: z.string(),
  codeNiveauDiplome: z.string(),
  libelleFormation: z.string(),
  libelleNiveauDiplome: z.string().optional(),
  typeFamille: TypeFamilleZodType.optional(),
  nbEtab: z.number(),
  apprentissage: z.boolean(),
  scolaire: z.boolean(),
  isFormationRenovee: z.boolean(),
  dateOuverture: z.date(),
  voie: VoieZodType
});

const QueryFiltersSchema = z.object({
  codeRegion: z.string().optional(),
  codeAcademie: z.string().optional(),
  codeDepartement: z.string().optional(),
  voie: VoieZodType.optional()
});

export type QueryFilters = z.infer<typeof QueryFiltersSchema>;

export const getDomaineDeFormationCodeNsfSchema = {
  params: z.object({
    codeNsf: z.string(),
  }),
  querystring: QueryFiltersSchema,
  response: {
    200: z.object({
      codeNsf: z.string(),
      libelleNsf: z.string(),
      filters: FiltersSchema,
      formations: z.array(FormationSchema),
    }),
  },
};
