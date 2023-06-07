import { Type } from "@sinclair/typebox";

const OptionSchema = Type.Object({
  label: Type.String(),
  value: Type.String(),
});

const FormationLineSchema = Type.Object({
  codeFormationDiplome: Type.String(),
  libelleDiplome: Type.String(),
  rentreeScolaire: Type.Optional(Type.String()),
  codeNiveauDiplome: Type.String(),
  libelleOfficielFamille: Type.Optional(Type.String()),
  dispositifId: Type.Optional(Type.String()),
  libelleDispositif: Type.Optional(Type.String()),
  libelleNiveauDiplome: Type.Optional(Type.String()),
  nbEtablissement: Type.Optional(Type.Number()),
  anneeDebut: Type.Optional(Type.Number()),
  effectif: Type.Optional(Type.Number()),
  effectif1: Type.Optional(Type.Number()),
  effectif2: Type.Optional(Type.Number()),
  effectif3: Type.Optional(Type.Number()),
  tauxRemplissage: Type.Optional(Type.Number()),
  tauxPression: Type.Optional(Type.Number()),
  tauxInsertion12mois: Type.Optional(Type.Number()),
  tauxPoursuiteEtudes: Type.Optional(Type.Number()),
  deltaPoursuiteEtudes: Type.Optional(Type.Number()),
  deltaInsertion12mois: Type.Optional(Type.Number()),
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
  rentreeScolaire: Type.Optional(Type.Array(Type.String())),
  order: Type.Optional(Type.Union([Type.Literal("asc"), Type.Literal("desc")])),
  orderBy: Type.Optional(
    Type.KeyOf(
      Type.Omit(FormationLineSchema, [
        "deltaPoursuiteEtudes",
        "deltaInsertion12mois",
      ])
    )
  ),
  withEmptyFormations: Type.Optional(Type.Boolean()),
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
          familles: Type.Array(OptionSchema),
          formations: Type.Array(OptionSchema),
        }),
        formations: Type.Array(FormationLineSchema),
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
  getDataForPanorama: {
    querystring: Type.Object({
      codeRegion: Type.String(),
      UAI: Type.Optional(Type.Array(Type.String())),
    }),
    response: {
      200: Type.Object({
        stats: Type.Object({
          tauxRemplissage: Type.Optional(Type.Number()),
          tauxInsertion12mois: Type.Optional(Type.Number()),
          tauxPoursuiteEtudes: Type.Optional(Type.Number()),
          effectif: Type.Optional(Type.Number()),
          nbFormations: Type.Optional(Type.Number()),
        }),
        formations: Type.Array(
          Type.Object({
            codeFormationDiplome: Type.String(),
            libelleDiplome: Type.String(),
            codeNiveauDiplome: Type.String(),
            dispositifId: Type.Optional(Type.String()),
            libelleDispositif: Type.String(),
            nbEtablissement: Type.Number(),
            effectif: Type.Optional(Type.Number()),
            effectifPrecedent: Type.Optional(Type.Number()),
            tauxRemplissage: Type.Optional(Type.Number()),
            tauxPression: Type.Optional(Type.Number()),
            tauxInsertion12mois: Type.Number(),
            tauxInsertion12moisPrecedent: Type.Optional(Type.Number()),
            tauxPoursuiteEtudes: Type.Number(),
            tauxPoursuiteEtudesPrecedent: Type.Optional(Type.Number()),
          })
        ),
      }),
    },
  },
  getFiltersForCadran: {
    querystring: Type.Object({
      codeRegion: Type.Optional(Type.String()),
    }),
    response: {
      200: Type.Object({
        filters: Type.Object({
          regions: Type.Array(OptionSchema),
          diplomes: Type.Array(OptionSchema),
        }),
      }),
    },
  },
  getRegions: {
    response: {
      200: Type.Array(OptionSchema),
    },
  },
} as const;
