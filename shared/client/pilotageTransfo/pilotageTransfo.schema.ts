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
  placesTransformees: Type.Number(),
  placesOuvertesScolaire: Type.Number(),
  placesOuvertesApprentissage: Type.Number(),
  placesOuvertes: Type.Number(),
  placesFermeesScolaire: Type.Number(),
  placesFermeesApprentissage: Type.Number(),
  placesFermees: Type.Number(),
  ratioOuverture: Type.Number(),
  ratioFermeture: Type.Number(),
  tauxTransformation: Type.Number(),
  effectif: Type.Number(),
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

const FormationTransformationStatsSchema = Type.Object({
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
  placesTransformees: Type.Number(),
  positionQuadrant: Type.Optional(Type.String()),
  continuum: Type.Optional(
    Type.Object({
      cfd: Type.String(),
      libelle: Type.Optional(Type.String()),
    })
  ),
});

const FormationsTransformationStatsFiltersSchema = Type.Object({
  rentreeScolaire: Type.Optional(Type.String()),
  codeNiveauDiplome: Type.Optional(Type.Array(Type.String())),
  filiere: Type.Optional(Type.Array(Type.String())),
});

export const pilotageTransformationSchemas = {
  getTransformationStats: {
    querystring: Type.Intersect([
      StatsFiltersSchema,
      Type.Object({
        order: Type.Optional(
          Type.Union([Type.Literal("asc"), Type.Literal("desc")])
        ),
        orderBy: Type.Optional(
          Type.KeyOf(Type.Omit(ScopedStatsTransfoSchema, []))
        ),
      }),
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
  getFormationsTransformationStats: {
    querystring: Type.Intersect([
      FormationsTransformationStatsFiltersSchema,
      Type.Object({
        status: Type.Optional(
          Type.Union([Type.Literal("draft"), Type.Literal("submitted")])
        ),
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
      Type.Object({
        order: Type.Optional(
          Type.Union([Type.Literal("asc"), Type.Literal("desc")])
        ),
        orderBy: Type.Optional(
          Type.KeyOf(Type.Omit(FormationTransformationStatsSchema, []))
        ),
      }),
    ]),
    response: {
      200: Type.Object({
        stats: Type.Object({
          tauxInsertion: Type.Number(),
          tauxPoursuite: Type.Number(),
        }),
        formations: Type.Array(FormationTransformationStatsSchema),
      }),
    },
  },
} as const;
