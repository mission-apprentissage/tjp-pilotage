import { z } from "zod";

const FormationTransformationStatsSchema = z.object({
  libelleDiplome: z.string().optional(),
  libelleDispositif: z.string().optional(),
  tauxInsertion: z.coerce.number(),
  tauxPoursuite: z.coerce.number(),
  tauxPression: z.coerce.number().optional(),
  dispositifId: z.string().optional(),
  cfd: z.string(),
  nbDemandes: z.coerce.number(),
  nbEtablissements: z.coerce.number(),
  differencePlaces: z.coerce.number(),
  placesOuvertes: z.coerce.number(),
  placesFermees: z.coerce.number(),
  placesTransformees: z.coerce.number(),
  positionCadran: z.string().optional(),
  continuum: z
    .object({
      cfd: z.string(),
      libelle: z.string().optional(),
    })
    .optional(),
});

export const getFormationsTransformationsSchema = {
  querystring: z.object({
    rentreeScolaire: z.string().optional(),
    codeNiveauDiplome: z.array(z.string()).optional(),
    filiere: z.array(z.string()).optional(),
    codeRegion: z.string().optional(),
    codeAcademie: z.string().optional(),
    codeDepartement: z.string().optional(),
    type: z.enum(["ouverture", "fermeture"]).optional(),
    tauxPression: z.enum(["faible", "eleve"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: FormationTransformationStatsSchema.keyof().optional(),
  }),
  response: {
    200: z.object({
      stats: z.object({
        tauxInsertion: z.coerce.number(),
        tauxPoursuite: z.coerce.number(),
      }),
      formations: z.array(FormationTransformationStatsSchema),
    }),
  },
};
