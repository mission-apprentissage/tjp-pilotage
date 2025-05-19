import { z } from "zod";

import { VoieZodType } from "../../enum/voieEnum";

const queryFiltersSchema = z.object({
  codeRegion: z.string().optional(),
  codeAcademie: z.string().optional(),
  codeDepartement: z.string().optional(),
  voie: VoieZodType.optional()
});

const tauxIJValueSchema = z.object({
  libelle: z.string(),
  apprentissage: z.number().optional(),
  scolaire: z.number().optional()
});

const tauxIJSchema = z.object({
  tauxPoursuite: z.array(tauxIJValueSchema),
  tauxInsertion: z.array(tauxIJValueSchema),
  tauxDevenirFavorable: z.array(tauxIJValueSchema),
});

const effectifsSchema = z.object({
  rentreeScolaire: z.string(),
  effectif: z.number(),
});

const soldePlacesTransformeeSchema = z.object({
  rentreeScolaire: z.number(),
  scolaire: z.number().optional(),
  apprentissage: z.number().optional(),
});

const etablissementsSchema = z.object({
  rentreeScolaire: z.string(),
  nbEtablissements: z.number(),
});

export const tauxSchema = z.object({
  value: z.number().optional(),
  rentreeScolaire: z.string(),
  scope: z.string(),
});

export type QueryFilters = z.infer<typeof queryFiltersSchema>;
export type Effectifs = z.infer<typeof effectifsSchema>;
export type TauxIJ = z.infer<typeof tauxIJSchema>;
export type TauxIJValue = z.infer<typeof tauxIJValueSchema>;
export type TauxIJKey = keyof TauxIJ;
export type Etablissements = z.infer<typeof etablissementsSchema>;

export const getFormationCfdIndicatorsSchema = {
  params: z.object({
    cfd: z.string(),
  }),
  querystring: queryFiltersSchema,
  response: {
    200: z.object({
      cfd: z.string(),
      libelle: z.string(),
      tauxIJ: tauxIJSchema,
      effectifs: z.array(effectifsSchema),
      etablissements: z.array(etablissementsSchema),
      tauxPressions: z.array(tauxSchema),
      tauxRemplissages: z.array(tauxSchema),
      soldePlacesTransformee: z.array(soldePlacesTransformeeSchema),
    }),
  },
};
