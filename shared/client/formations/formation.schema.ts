import { Type } from "@sinclair/typebox";

const OptionSchema = Type.Object({
  label: Type.String(),
  value: Type.String(),
});

const FiltersSchema = Type.Object({
  cfd: Type.Optional(Type.Array(Type.String())),
  codeRegion: Type.Optional(Type.Array(Type.String())),
  codeAcademie: Type.Optional(Type.Array(Type.String())),
  codeDepartement: Type.Optional(Type.Array(Type.String())),
  commune: Type.Optional(Type.Array(Type.String())),
  codeDiplome: Type.Optional(Type.Array(Type.String())),
  codeDispositif: Type.Optional(Type.Array(Type.String())),
  cfdFamille: Type.Optional(Type.Array(Type.String())),
  order: Type.Optional(Type.Union([Type.Literal("asc"), Type.Literal("desc")])),
  orderBy: Type.Optional(
    Type.Union([
      Type.Literal("libelleDiplome"),
      Type.Literal("effectif"),
      Type.Literal("nbEtablissement"),
      Type.Literal("tauxInsertion6mois"),
      Type.Literal("tauxPoursuiteEtudes"),
    ])
  ),
});

export const formationSchemas = {
  getFormations: {
    querystring: Type.Intersect([
      FiltersSchema,
      Type.Object({
        offset: Type.Optional(Type.Number()),
        limit: Type.Optional(Type.Number()),
      }),
    ]),
    response: {
      200: Type.Object({
        count: Type.Number(),
        filters: Type.Object({
          regions: Type.Array(OptionSchema),
          academies: Type.Array(OptionSchema),
          departements: Type.Array(OptionSchema),
          communes: Type.Array(OptionSchema),
          diplomes: Type.Array(OptionSchema),
          dispositifs: Type.Array(OptionSchema),
          familles: Type.Array(OptionSchema),
          formations: Type.Array(OptionSchema),
        }),
        formations: Type.Array(
          Type.Object({
            codeFormationDiplome: Type.String(),
            libelleDiplome: Type.String(),
            codeNiveauDiplome: Type.String(),
            // dateOuverture: Type.Optional(Type.String()),
            // dateFermeture: Type.Optional(Type.String()),
            libelleOfficielFamille: Type.Optional(Type.String()),
            dispositifId: Type.Optional(Type.String()),
            libelleDispositif: Type.Optional(Type.String()),
            libelleNiveauDiplome: Type.String(),
            nbEtablissement: Type.Optional(Type.Number()),
            effectif: Type.Optional(Type.Number()),
            tauxInsertion6mois: Type.Optional(Type.Number()),
            tauxPoursuiteEtudes: Type.Optional(Type.Number()),
            deltaPoursuiteEtudes: Type.Optional(Type.Number()),
            deltaInsertion6mois: Type.Optional(Type.Number()),
          })
        ),
      }),
    },
  },
  getFormationsCsv: {
    produces: ["text/csv"] as string[],
    querystring: FiltersSchema,
    response: {
      200: Type.String(),
    },
  },
} as const;
