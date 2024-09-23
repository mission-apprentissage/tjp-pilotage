import { ScopeEnum } from "shared";
import { DemandeStatutZodType } from "shared/enum/demandeStatutEnum";
import { scope } from "shared/enum/scopeEnum";
import { SecteurZodType } from "shared/enum/secteurEnum";
import { z } from "zod";

const OptionSchema = z.object({
  label: z.coerce.string(),
  value: z.coerce.string(),
});

const ScopedStatsTransfoSchema = z.object({
  key: z.string(),
  libelle: z.string(),
  libelleAcademie: z.string().optional(),
  code: z.string(),
  countDemande: z.coerce.number(),
  effectif: z.number().optional(),
  placesTransformees: z.number(),
  tauxTransformation: z.number().optional(),
  placesOuvertesScolaire: z.number(),
  placesFermeesScolaire: z.number(),
  placesOuvertesScolaireQ1Q2: z.number(),
  placesFermeesScolaireQ3Q4: z.number(),
  placesOuvertesApprentissage: z.number(),
  placesFermeesApprentissage: z.number(),
  placesOuvertesApprentissageQ1Q2: z.number(),
  placesFermeesApprentissageQ3Q4: z.number(),
  placesOuvertes: z.number(),
  placesFermees: z.number(),
  placesOuvertesQ1Q2: z.number(),
  placesFermeesQ3Q4: z.number(),
  placesColorees: z.number(),
  placesColoreesQ3Q4: z.number(),
  placesOuvertesTransformationEcologique: z.number(),
  ratioOuverture: z.number().optional(),
  ratioFermeture: z.number().optional(),
});

const QuerySchema = z.object({
  rentreeScolaire: z.array(z.string()).optional(),
  codeNiveauDiplome: z.array(z.string()).optional(),
  CPC: z.array(z.string()).optional(),
  codeNsf: z.array(z.string()).optional(),
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
  statut: z.array(DemandeStatutZodType).optional(),
  withColoration: z.string().optional(),
});

export type QuerySchema = z.infer<typeof QuerySchema>;

const StatsTransfoSchema = z.record(
  z.string(),
  ScopedStatsTransfoSchema.extend({
    code: z.string().optional(),
    libelle: z.string().optional(),
  })
);

export const getStatsPilotageIntentionsSchema = {
  querystring: QuerySchema,
  response: {
    200: z.object({
      ["projet de demande"]: StatsTransfoSchema,
      ["demande validée"]: StatsTransfoSchema,
      all: StatsTransfoSchema,
      campagne: z.object({
        annee: z.string(),
        statut: z.string(),
      }),
      filters: z.object({
        campagnes: z.array(OptionSchema),
        rentreesScolaires: z.array(OptionSchema),
        regions: z.array(OptionSchema),
        academies: z.array(OptionSchema),
        departements: z.array(OptionSchema),
        CPCs: z.array(OptionSchema),
        libellesNsf: z.array(OptionSchema),
        diplomes: z.array(OptionSchema),
        secteurFilters: z.array(OptionSchema),
        statutFilters: z.array(OptionSchema),
      }),
    }),
  },
};
