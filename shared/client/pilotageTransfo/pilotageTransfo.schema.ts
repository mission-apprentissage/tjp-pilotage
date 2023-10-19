import { Type } from "@sinclair/typebox";

const StatsTransfoSchema = Type.Object({
  countDemande: Type.Number(),
  differenceCapaciteScolaire: Type.Number(),
  differenceCapaciteApprentissage: Type.Number(),
  placesOuvertesScolaire: Type.Number(),
  placesFermeesScolaire: Type.Number(),
  placesOuvertesApprentissage: Type.Number(),
  placesFermeesApprentissage: Type.Number(),
  tauxTransformation: Type.Number(),
});

export const pilotageTransformationSchemas = {
  getTransformationStats: {
    querystring: Type.Object({ rentreeScolaire: Type.Optional(Type.Number()) }),
    response: {
      200: Type.Object({
        submitted: Type.Object({
          national: Type.Object(StatsTransfoSchema.properties),
          regions: Type.Record(
            Type.String(),
            Type.Object({
              ...StatsTransfoSchema.properties,
              libelleRegion: Type.Optional(Type.String()),
              codeRegion: Type.Optional(Type.String()),
            })
          ),
          academies: Type.Record(
            Type.String(),
            Type.Object({
              ...StatsTransfoSchema.properties,
              libelleAcademie: Type.Optional(Type.String()),
              codeAcademie: Type.Optional(Type.String()),
            })
          ),
          departements: Type.Record(
            Type.String(),
            Type.Object({
              ...StatsTransfoSchema.properties,
              libelleDepartement: Type.Optional(Type.String()),
              codeDepartement: Type.Optional(Type.String()),
            })
          ),
        }),
        draft: Type.Object({
          national: Type.Object(StatsTransfoSchema.properties),
          regions: Type.Record(
            Type.String(),
            Type.Object({
              ...StatsTransfoSchema.properties,
              libelleRegion: Type.Optional(Type.String()),
              codeRegion: Type.Optional(Type.String()),
            })
          ),
          academies: Type.Record(
            Type.String(),
            Type.Object({
              ...StatsTransfoSchema.properties,
              libelleAcademie: Type.Optional(Type.String()),
              codeAcademie: Type.Optional(Type.String()),
            })
          ),
          departements: Type.Record(
            Type.String(),
            Type.Object({
              ...StatsTransfoSchema.properties,
              libelleDepartement: Type.Optional(Type.String()),
              codeDepartement: Type.Optional(Type.String()),
            })
          ),
        }),
      }),
    },
  },
} as const;
