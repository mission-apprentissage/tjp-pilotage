import { ScopeEnum } from "shared";
import { DemandeStatutZodType } from "shared/enum/demandeStatutEnum";
import { scope } from "shared/enum/scopeEnum";
import { SecteurZodType } from "shared/enum/secteurEnum";
import { z } from "zod";

export const StatsSchema = z.object({
  libelle: z.string(),
  code: z.string(),
  effectif: z.number(),
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
    effectif: true,
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
  secteur: z.array(SecteurZodType).optional(),
  statut: z.array(DemandeStatutZodType).optional(),
  withColoration: z.string().optional(),
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