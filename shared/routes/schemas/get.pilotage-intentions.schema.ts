import { z } from "zod";

import { DemandeStatutEnum, DemandeStatutZodType } from "../../enum/demandeStatutEnum";
import { TypeFormationSpecifiqueZodType } from "../../enum/formationSpecifiqueEnum";
import { scope, ScopeEnum } from "../../enum/scopeEnum";
import { SecteurZodType } from "../../enum/secteurEnum";
import { FormationSpecifiqueFlagsSchema } from "../../schema/formationSpecifiqueFlagsSchema";
import { OptionSchema } from "../../schema/optionSchema";

const FormationTransformationStatsSchema = z.object({
  libelleFormation: z.string().optional(),
  formationSpecifique: FormationSpecifiqueFlagsSchema,
  libelleDispositif: z.string().optional(),
  tauxInsertion: z.coerce.number().optional(),
  tauxPoursuite: z.coerce.number().optional(),
  tauxDevenirFavorable: z.coerce.number().optional(),
  tauxPression: z.coerce.number().optional(),
  codeDispositif: z.string().optional(),
  cfd: z.string(),
  nbDemandes: z.coerce.number(),
  nbEtablissements: z.coerce.number(),
  effectif: z.coerce.number(),
  placesOuvertes: z.coerce.number(),
  placesFermees: z.coerce.number(),
  placesColoreesOuvertes: z.coerce.number(),
  placesColoreesFermees: z.coerce.number(),
  placesTransformees: z.coerce.number(),
  positionQuadrant: z.string().optional(),
  continuum: z
    .object({
      cfd: z.string(),
      libelleFormation: z.string().optional(),
    })
    .optional(),
});

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
  countDemande: z.coerce.number(),
  placesOuvertesQ1: z.number(),
  placesFermeesQ4: z.number(),
  placesColoreesQ4: z.number(),
  placesOuvertesTransformationEcologique: z.number(),
});

const StatsRepartitionSchema = z.record(z.string(), StatsSchema);

const QuerySchema = z.object({
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
  type: z.enum(["ouverture", "fermeture", "coloration"]).optional(),
  tauxPression: z.enum(["faible", "eleve"]).optional(),
  withColoration: z.string().optional(),
  formationSpecifique: z.array(TypeFormationSpecifiqueZodType).optional(),
  orderQuadrant: z.enum(["asc", "desc"]).optional(),
  orderByQuadrant: FormationTransformationStatsSchema.keyof().optional(),
});

export type QuerySchema = z.infer<typeof QuerySchema>;

export const getPilotageIntentionsSchema = {
  querystring: QuerySchema,
  response: {
    200: z.object({
      repartition: z.object({
        domaines: StatsRepartitionSchema,
        top10Domaines: StatsRepartitionSchema,
        niveauxDiplome: StatsRepartitionSchema,
        zonesGeographiques: StatsRepartitionSchema,
        positionsQuadrant: StatsRepartitionSchema,
        // statuts: StatsRepartitionSchema,
        [DemandeStatutEnum["demande validée"]]: StatsRepartitionSchema,
        [DemandeStatutEnum["projet de demande"]]: StatsRepartitionSchema,
        // all: StatsRepartitionSchema,
      }),
      statsSortie: z.object({
        tauxInsertion: z.coerce.number(),
        tauxPoursuite: z.coerce.number(),
      }),
      formations: z.array(FormationTransformationStatsSchema),
      filtersOptions: z.object({
        campagnes: z.array(OptionSchema),
        rentreesScolaires: z.array(OptionSchema),
        regions: z.array(OptionSchema),
        academies: z.array(OptionSchema),
        departements: z.array(OptionSchema),
        CPCs: z.array(OptionSchema),
        nsfs: z.array(OptionSchema),
        niveauxDiplome: z.array(OptionSchema),
        secteurs: z.array(OptionSchema),
        statuts: z.array(OptionSchema),
      }),
      campagne: z.object({
        annee: z.string(),
        statut: z.string(),
      }),
    }),
  },
};
