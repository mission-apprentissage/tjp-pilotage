import { Type } from "@sinclair/typebox";

const OptionSchema = Type.Object({
  label: Type.String(),
  value: Type.String(),
});

const StatsSchema = Type.Object({
  effectif: Type.Optional(Type.Number()),
  nbFormations: Type.Optional(Type.Number()),
  nbEtablissements: Type.Optional(Type.Number()),
  poursuite: Type.Optional(Type.Number()),
  insertion: Type.Optional(Type.Number()),
});

const StatsAnneeSchema = Type.Object({
  nationale: StatsSchema,
  filtered: StatsSchema,
});

const StatsRegionLineSchema = Type.Object({
  codeRegion: Type.String(),
  libelleRegion: Type.Optional(Type.String()),
  poursuite: Type.Optional(Type.Number()),
  insertion: Type.Optional(Type.Number()),
});

const FiltersSchema = Type.Object({
  codeNiveauDiplome: Type.Optional(Type.Array(Type.String())),
  codeRegion: Type.Optional(Type.String()),
});

const FiltersRegionsSchema = Type.Object({
  codeNiveauDiplome: Type.Optional(Type.Array(Type.String())),
  order: Type.Optional(Type.Union([Type.Literal("asc"), Type.Literal("desc")])),
  orderBy: Type.Optional(Type.KeyOf(Type.Omit(StatsRegionLineSchema, []))),
});

export const pilotageReformeSchemas = {
  getPilotageReformeStats: {
    querystring: FiltersSchema,
    response: {
      200: Type.Object({
        filters: Type.Object({
          regions: Type.Array(OptionSchema),
          diplomes: Type.Array(OptionSchema),
        }),
        anneeN: StatsAnneeSchema,
        anneeNMoins1: StatsAnneeSchema,
      }),
    },
  },
  getPilotageReformeStatsRegions: {
    querystring: FiltersRegionsSchema,
    response: {
      200: Type.Object({
        filters: Type.Object({
          diplomes: Type.Array(OptionSchema),
        }),
        statsRegions: Type.Array(StatsRegionLineSchema),
      }),
    },
  },
} as const;
