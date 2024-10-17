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

const queryFiltersSchema = z.object({});

export type Filters = z.infer<typeof queryFiltersSchema>;

export const getDomaineDeFormationSchema = {
  params: z.object({
    codeNsf: z.string(),
  }),
  response: {
    200: z.object({
      codeNsf: z.string(),
      libelleNsf: z.string(),
      filters: filtersSchema,
    }),
  },
};
