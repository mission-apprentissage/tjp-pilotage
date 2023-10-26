import { Type } from "@sinclair/typebox";

const OptionSchema = Type.Object({
  label: Type.String(),
  value: Type.String(),
});

const ScopedStatsTransfoSchema = Type.Object({
  libelle: Type.Optional(Type.String()),
  libelleAcademie: Type.Optional(Type.String()),
  libelleRegion: Type.Optional(Type.String()),
  countDemande: Type.Number(),
  differenceCapaciteScolaire: Type.Number(),
  differenceCapaciteApprentissage: Type.Number(),
  placesOuvertesScolaire: Type.Number(),
  placesFermeesScolaire: Type.Number(),
  placesOuvertesApprentissage: Type.Number(),
  placesFermeesApprentissage: Type.Number(),
  tauxTransformation: Type.Number(),
});

const StatsTransfoSchema = Type.Object({
  national: Type.Object(ScopedStatsTransfoSchema.properties),
  regions: Type.Record(
    Type.String(),
    Type.Object({
      ...ScopedStatsTransfoSchema.properties,
      codeRegion: Type.Optional(Type.String()),
    })
  ),
  academies: Type.Record(
    Type.String(),
    Type.Object({
      ...ScopedStatsTransfoSchema.properties,
      codeAcademie: Type.Optional(Type.String()),
    })
  ),
  departements: Type.Record(
    Type.String(),
    Type.Object({
      ...ScopedStatsTransfoSchema.properties,
      codeDepartement: Type.Optional(Type.String()),
    })
  ),
});


const StatsFiltersSchema = Type.Object({
  rentreeScolaire: Type.Optional(Type.String()),
  codeNiveauDiplome: Type.Optional(Type.Array(Type.String())),
  filiere: Type.Optional(Type.Array(Type.String())),
});

export const pilotageTransformationSchemas = {
  getTransformationStats: {
    querystring: Type.Intersect([
      StatsFiltersSchema,
    ]),
    response: {
      200: Type.Object({
        submitted: StatsTransfoSchema,
        draft: StatsTransfoSchema,
        all: StatsTransfoSchema,
        filters: Type.Object({
          rentreesScolaires: Type.Array(OptionSchema),
          regions: Type.Array(OptionSchema),
          academies: Type.Array(OptionSchema),
          departements: Type.Array(OptionSchema),
          filieres: Type.Array(OptionSchema),
          diplomes: Type.Array(OptionSchema),
        }),
      }),
    },
  },
} as const;
