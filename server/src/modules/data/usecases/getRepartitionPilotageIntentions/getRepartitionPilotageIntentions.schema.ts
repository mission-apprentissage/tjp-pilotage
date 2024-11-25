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
  placesNonColoreesTransformees: z.number(),
  placesColoreesOuvertes: z.number(),
  placesColoreesFermees: z.number(),
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
    placesColorees: true,
    placesTransformees: true,
    tauxTransformation: true,
    solde: true,
  })
    .keyof()
    .optional(),
  scope: z.preprocess((val) => {
    if (!Object.keys(ScopeEnum).includes(val as string)) {
      return ScopeEnum.national; // Valeur par défaut si invalide
    }
    return val; // Sinon, retourne la valeur valide
  }, scope),
  codeRegion: z.string().optional(),
  codeAcademie: z.string().optional(),
  codeDepartement: z.string().optional(),
  campagne: z.string().optional(),
  secteur: z.array(SecteurZodType).optional(),
  statut: z.array(DemandeStatutZodType.exclude(["refusée", "supprimée"])).optional(),
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
      positionsQuadrant: StatsRepartitionSchema,
    }),
  },
};
