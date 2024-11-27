import { z } from "zod";

import { DemandeStatutZodType } from "../../enum/demandeStatutEnum";
import { TypeFormationSpecifiqueZodType } from "../../enum/formationSpecifiqueEnum";
import { scope, ScopeEnum } from "../../enum/scopeEnum";
import { SecteurZodType } from "../../enum/secteurEnum";

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
  placesOuvertesScolaireQ1: z.number(),
  placesFermeesScolaireQ4: z.number(),
  placesOuvertesApprentissage: z.number(),
  placesFermeesApprentissage: z.number(),
  placesOuvertesApprentissageQ1: z.number(),
  placesFermeesApprentissageQ4: z.number(),
  placesOuvertes: z.number(),
  placesFermees: z.number(),
  placesOuvertesQ1: z.number(),
  placesFermeesQ4: z.number(),
  placesNonColoreesTransformees: z.number(),
  placesColoreesOuvertes: z.number(),
  placesColoreesFermees: z.number(),
  placesColorees: z.number(),
  placesColoreesQ4: z.number(),
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
  statut: z.array(DemandeStatutZodType.exclude(["refusée", "supprimée"])).optional(),
  withColoration: z.string().optional(),
  formationSpecifique: z.array(TypeFormationSpecifiqueZodType).optional(),
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
        nsfs: z.array(OptionSchema),
        niveauxDiplome: z.array(OptionSchema),
        secteurs: z.array(OptionSchema),
        statuts: z.array(OptionSchema),
      }),
    }),
  },
};
