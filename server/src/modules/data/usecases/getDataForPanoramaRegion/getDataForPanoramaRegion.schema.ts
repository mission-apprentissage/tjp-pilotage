import { z } from "zod";

const OptionSchema = z.object({
  label: z.coerce.string(),
  value: z.coerce.string(),
});

const FormationSchema = z.object({
  cfd: z.string(),
  libelleFormation: z.string(),
  codeNiveauDiplome: z.string(),
  libelleNiveauDiplome: z.string().optional(),
  codeDispositif: z.string().optional(),
  libelleDispositif: z.string().optional(),
  nbEtablissement: z.coerce.number(),
  effectif: z.coerce.number().optional(),
  effectifPrecedent: z.coerce.number().optional(),
  tauxRemplissage: z.coerce.number().optional(),
  tauxPression: z.coerce.number().optional(),
  tauxInsertion: z.coerce.number(),
  tauxInsertionPrecedent: z.coerce.number().optional(),
  tauxPoursuite: z.coerce.number(),
  tauxPoursuitePrecedent: z.coerce.number().optional(),
  tauxDevenirFavorable: z.coerce.number(),
  positionQuadrant: z.string().optional(),
  continuum: z
    .object({
      cfd: z.string(),
      libelleFormation: z.string().optional(),
    })
    .optional(),
});

const TopFlopSchema = FormationSchema.extend({
  tauxInsertion: z.coerce.number().optional(),
}).omit({ positionQuadrant: true });

export const getDataForPanoramaRegionSchema = {
  querystring: z.object({
    codeRegion: z.string(),
    codeNiveauDiplome: z.array(z.string()).optional(),
    codeNsf: z.array(z.string()).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: FormationSchema.keyof().optional(),
  }),
  response: {
    200: z.object({
      topFlops: z.array(TopFlopSchema),
      formations: z.array(FormationSchema),
      filters: z.object({
        diplomes: z.array(OptionSchema),
        libellesNsf: z.array(OptionSchema),
      }),
    }),
  },
};

export interface Filters
  extends z.infer<typeof getDataForPanoramaRegionSchema.querystring> {
  rentreeScolaire?: string;
  millesimeSortie?: string;
}
