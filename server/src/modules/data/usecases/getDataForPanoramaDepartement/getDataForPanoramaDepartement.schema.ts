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
  dispositifId: z.string().optional(),
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
  libelleFiliere: z.string().optional(),
  continuum: z
    .object({
      cfd: z.string(),
      libelle: z.string().optional(),
    })
    .optional(),
});

export const getDataForPanoramaDepartementSchema = {
  querystring: z.object({
    codeDepartement: z.string(),
    codeNiveauDiplome: z.array(z.string()).optional(),
    libelleFiliere: z.array(z.string()).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: FormationSchema.keyof().optional(),
  }),
  response: {
    200: z.object({
      formations: z.array(FormationSchema),
      filters: z.object({
        diplomes: z.array(OptionSchema),
        filieres: z.array(OptionSchema),
      }),
    }),
  },
};
