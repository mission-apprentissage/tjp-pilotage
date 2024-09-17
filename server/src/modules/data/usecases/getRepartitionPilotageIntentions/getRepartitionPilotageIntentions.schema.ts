import { ScopeEnum } from "shared";
import { scope } from "shared/enum/scopeEnum";
import { z } from "zod";

export const StatsSchema = z.object({
  libelle: z.string(),
  code: z.string(),
  placesEffectivementOccupees: z.number(),
  placesOuvertes: z.number(),
  placesFermees: z.number(),
  placesColorees: z.number(),
  placesTransformees: z.number(),
  solde: z.number(),
  tauxTransformation: z.number().optional(),
  tauxTransformationOuvertures: z.number().optional(),
  tauxTransformationFermetures: z.number().optional(),
  tauxTransformationColorations: z.number().optional(),
  ratioOuverture: z.number().optional(),
  ratioFermeture: z.number().optional(),
});

const StatsRepartitionSchema = z.record(z.string(), StatsSchema);

export const FiltersSchema = z.object({
  rentreeScolaire: z.array(z.string()).optional(),
  codeNiveauDiplome: z.array(z.string()).optional(),
  CPC: z.array(z.string()).optional(),
  codeNsf: z.array(z.string()).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: StatsSchema.pick({
    libelle: true,
    placesEffectivementOccupees: true,
    ratioFermeture: true,
    ratioOuverture: true,
    code: true,
    placesFermees: true,
    placesOuvertes: true,
    placesTransformees: true,
    tauxTransformation: true,
    tauxTransformationColorations: true,
    tauxTransformationFermetures: true,
    tauxTransformationOuvertures: true,
    solde: true,
  })
    .keyof()
    .optional(),
  scope: scope.default(ScopeEnum.national),
  codeRegion: z.string().optional(),
  codeAcademie: z.string().optional(),
  codeDepartement: z.string().optional(),
  campagne: z.string().optional(),
});

export const getRepartitionPilotageIntentionsSchema = {
  querystring: FiltersSchema,
  response: {
    200: z.object({
      domaines: StatsRepartitionSchema,
      top10Domaines: StatsRepartitionSchema,
      niveauxDiplome: StatsRepartitionSchema,
      zonesGeographiques: StatsRepartitionSchema,
    }),
  },
};
