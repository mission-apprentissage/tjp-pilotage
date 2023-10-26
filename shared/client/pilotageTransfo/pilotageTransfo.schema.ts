import { Type } from "@sinclair/typebox";

const OptionSchema = Type.Object({
  label: Type.String(),
  value: Type.String(),
});

const ScopedStatsTransfoSchema = Type.Object({
  libelle: Type.Optional(Type.String()),
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

export const pilotageTransformationSchemas = {
  getTransformationStats: {
    querystring: Type.Object({
      rentreeScolaire: Type.Optional(Type.Number()),
    }),
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
        }),
      }),
    },
  },
  getformationsTransformationStats: {
    querystring: Type.Object({
      status: Type.Optional(
        Type.Union([Type.Literal("draft"), Type.Literal("submitted")])
      ),
      rentreeScolaire: Type.Optional(Type.Number()),
      codeRegion: Type.Optional(Type.String()),
      codeAcademie: Type.Optional(Type.String()),
      codeDepartement: Type.Optional(Type.String()),
      type: Type.Optional(
        Type.Union([Type.Literal("ouverture"), Type.Literal("fermeture")])
      ),
      tauxPression: Type.Optional(
        Type.Union([Type.Literal("eleve"), Type.Literal("faible")])
      ),
    }),
    response: {
      200: Type.Object({
        stats: Type.Object({
          tauxInsertion: Type.Number(),
          tauxPoursuite: Type.Number(),
        }),
        formations: Type.Array(
          Type.Object({
            libelleDiplome: Type.Optional(Type.String()),
            libelleDispositif: Type.Optional(Type.String()),
            tauxInsertion: Type.Number(),
            tauxPoursuite: Type.Number(),
            tauxPression: Type.Optional(Type.Number()),
            dispositifId: Type.Optional(Type.String()),
            cfd: Type.String(),
            nbDemandes: Type.Number(),
            nbEtablissements: Type.Number(),
            differencePlaces: Type.Number(),
            placesOuvertes: Type.Number(),
            placesFermees: Type.Number(),
            continuum: Type.Optional(
              Type.Object({
                cfd: Type.String(),
                libelle: Type.Optional(Type.String()),
              })
            ),
          })
        ),
      }),
    },
  },
} as const;
