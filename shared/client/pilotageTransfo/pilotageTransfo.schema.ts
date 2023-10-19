import { Type } from "@sinclair/typebox";

const ScopedStatsTransfoSchema = Type.Object({
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
      libelleRegion: Type.Optional(Type.String()),
      codeRegion: Type.Optional(Type.String()),
    })
  ),
  academies: Type.Record(
    Type.String(),
    Type.Object({
      ...ScopedStatsTransfoSchema.properties,
      libelleAcademie: Type.Optional(Type.String()),
      codeAcademie: Type.Optional(Type.String()),
    })
  ),
  departements: Type.Record(
    Type.String(),
    Type.Object({
      ...ScopedStatsTransfoSchema.properties,
      libelleDepartement: Type.Optional(Type.String()),
      codeDepartement: Type.Optional(Type.String()),
    })
  ),
})

export const pilotageTransformationSchemas = {
  getTransformationStats: {
    querystring: Type.Object({ rentreeScolaire: Type.Optional(Type.Number()) }),
    response: {
      200: Type.Object({
        submitted: StatsTransfoSchema,
        draft: StatsTransfoSchema,
        all: StatsTransfoSchema,
      }),
    },
  },
} as const;
