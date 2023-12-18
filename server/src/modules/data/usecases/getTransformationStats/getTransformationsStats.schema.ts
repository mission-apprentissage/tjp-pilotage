import { z } from "zod";

const OptionSchema = z.object({
  label: z.coerce.string(),
  value: z.coerce.string(),
});

const ScopedStatsTransfoSchema = z.object({
  libelle: z.string().optional(),
  libelleAcademie: z.string().optional(),
  libelleRegion: z.string().optional(),
  countDemande: z.coerce.number(),
  differenceCapaciteScolaire: z.coerce.number(),
  differenceCapaciteApprentissage: z.coerce.number(),
  placesTransformees: z.coerce.number(),
  placesOuvertesScolaire: z.coerce.number(),
  placesOuvertesApprentissage: z.coerce.number(),
  placesOuvertes: z.coerce.number(),
  placesFermeesScolaire: z.coerce.number(),
  placesFermeesApprentissage: z.coerce.number(),
  placesFermees: z.coerce.number(),
  ratioOuverture: z.coerce.number(),
  ratioFermeture: z.coerce.number(),
  tauxTransformation: z.coerce.number(),
  effectif: z.coerce.number(),
});

const StatsTransfoSchema = z.record(
  z.string(),
  ScopedStatsTransfoSchema.extend({
    code: z.string().optional(),
    libelle: z.string().optional(),
  })
);

export const ScopeEnum = z.enum([
  "regions",
  "academies",
  "departements",
  "national",
]);

export type Scope = z.infer<typeof ScopeEnum>;

const QuerySchema = z.object({
  rentreeScolaire: z.string().optional(),
  codeNiveauDiplome: z.array(z.string()).optional(),
  CPC: z.array(z.string()).optional(),
  filiere: z.array(z.string()).optional(),
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
  scope: ScopeEnum.default("national"),
});

export type QuerySchema = z.infer<typeof QuerySchema>;

export const getTransformationStatsSchema = {
  querystring: QuerySchema,
  response: {
    200: z.object({
      submitted: StatsTransfoSchema,
      draft: StatsTransfoSchema,
      all: StatsTransfoSchema,
      filters: z.object({
        rentreesScolaires: z.array(OptionSchema),
        regions: z.array(OptionSchema),
        academies: z.array(OptionSchema),
        departements: z.array(OptionSchema),
        CPCs: z.array(OptionSchema),
        filieres: z.array(OptionSchema),
        diplomes: z.array(OptionSchema),
      }),
    }),
  },
};
