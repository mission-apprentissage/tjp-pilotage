import { ScopeEnum } from "shared";
import { scope } from "shared/enum/scopeEnum";
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
  placesOuvertesApprentissage: z.number(),
  placesFermeesApprentissage: z.number(),
  placesOuvertes: z.number(),
  placesOuvertesColorees: z.number(),
  placesFermees: z.number(),
  ratioOuverture: z.number(),
  ratioFermeture: z.number(),
});

const QuerySchema = z.object({
  rentreeScolaire: z.array(z.string()).optional(),
  codeNiveauDiplome: z.array(z.string()).optional(),
  CPC: z.array(z.string()).optional(),
  codeNsf: z.array(z.string()).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: ScopedStatsTransfoSchema.pick({
    libelle: true,
    effectif: true,
    ratioFermeture: true,
    ratioOuverture: true,
    code: true,
    placesFermees: true,
    placesOuvertes: true,
    placesTransformees: true,
    tauxTransformation: true,
  })
    .keyof()
    .optional(),
  scope: scope.default(ScopeEnum.national),
  codeRegion: z.string().optional(),
  codeAcademie: z.string().optional(),
  codeDepartement: z.string().optional(),
  campagne: z.string().optional(),
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
      }),
    }),
  },
};
