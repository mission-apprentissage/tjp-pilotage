import { Type } from "@sinclair/typebox";

const OptionSchema = Type.Object({
  label: Type.String(),
  value: Type.String(),
});

const StatsDemandesItem = Type.Object({
  id: Type.String(),
  cfd: Type.Optional(Type.String()),
  libelleDiplome: Type.Optional(Type.String()),
  dispositifId: Type.Optional(Type.String()),
  libelleDispositif: Type.Optional(Type.String()),
  niveauDiplome: Type.Optional(Type.String()),
  uai: Type.Optional(Type.String()),
  libelleEtablissement: Type.Optional(Type.String()),
  commune: Type.Optional(Type.String()),
  rentreeScolaire: Type.Optional(Type.Number()),
  typeDemande: Type.Optional(Type.String()),
  motif: Type.Optional(Type.Array(Type.String())),
  autreMotif: Type.Optional(Type.String()),
  coloration: Type.Optional(Type.Boolean()),
  libelleColoration: Type.Optional(Type.String()),
  libelleFCIL: Type.Optional(Type.String()),
  amiCma: Type.Optional(Type.Boolean()),
  poursuitePedagogique: Type.Optional(Type.Boolean()),
  commentaire: Type.Optional(Type.String()),
  libelleFiliere: Type.Optional(Type.String()),
  status: Type.String(),
  codeRegion: Type.Optional(Type.String()),
  libelleRegion: Type.Optional(Type.String()),
  codeAcademie: Type.Optional(Type.String()),
  codeDepartement: Type.Optional(Type.String()),
  libelleDepartement: Type.Optional(Type.String()),
  createdAt: Type.String(),
  compensationCfd: Type.Optional(Type.String()),
  compensationDispositifId: Type.Optional(Type.String()),
  compensationUai: Type.Optional(Type.String()),
  differenceCapaciteScolaire: Type.Optional(Type.Number()),
  capaciteScolaireActuelle: Type.Optional(Type.Number()),
  capaciteScolaire: Type.Optional(Type.Number()),
  capaciteScolaireColoree: Type.Optional(Type.Number()),
  differenceCapaciteApprentissage: Type.Optional(Type.Number()),
  capaciteApprentissageActuelle: Type.Optional(Type.Number()),
  capaciteApprentissage: Type.Optional(Type.Number()),
  capaciteApprentissageColoree: Type.Optional(Type.Number()),
  insertion: Type.Optional(Type.Number()),
  poursuite: Type.Optional(Type.Number()),
  devenirFavorable: Type.Optional(Type.Number()),
  pression: Type.Optional(Type.Number()),
  nbEtablissement: Type.Optional(Type.Number()),
  positionQuadrant: Type.Optional(Type.String()),
  tauxInsertionMoyen: Type.Optional(Type.Number()),
  tauxPoursuiteMoyen: Type.Optional(Type.Number()),
});

const StatsFiltersSchema = Type.Object({
  codeRegion: Type.Optional(Type.Array(Type.String())),
  codeAcademie: Type.Optional(Type.Array(Type.String())),
  codeDepartement: Type.Optional(Type.Array(Type.String())),
  commune: Type.Optional(Type.Array(Type.String())),
  uai: Type.Optional(Type.Array(Type.String())),
  rentreeScolaire: Type.Optional(Type.String()),
  typeDemande: Type.Optional(Type.Array(Type.String())),
  motif: Type.Optional(Type.Array(Type.String())),
  status: Type.Optional(
    Type.Union([
      Type.Literal("draft"),
      Type.Literal("submitted"),
      Type.Undefined(),
    ])
  ),
  codeNiveauDiplome: Type.Optional(Type.Array(Type.String())),
  cfd: Type.Optional(Type.Array(Type.String())),
  dispositif: Type.Optional(Type.Array(Type.String())),
  filiere: Type.Optional(Type.Array(Type.String())),
  cfdFamille: Type.Optional(Type.Array(Type.String())),
  coloration: Type.Optional(Type.String()),
  amiCMA: Type.Optional(Type.String()),
  secteur: Type.Optional(Type.String()),
  compensation: Type.Optional(Type.String()),
  positionQuadrant: Type.Optional(Type.String()),
  order: Type.Optional(Type.Union([Type.Literal("asc"), Type.Literal("desc")])),
  orderBy: Type.Optional(Type.KeyOf(Type.Omit(StatsDemandesItem, []))),
});

const CountCapaciteStatsDemandesSchema = Type.Object({
  total: Type.Number(),
  scolaire: Type.Number(),
  apprentissage: Type.Number(),
  coloration: Type.Optional(Type.Number()),
});

export const restitutionIntentionsSchemas = {
  getRestitutionIntentionsStats: {
    querystring: Type.Intersect([
      StatsFiltersSchema,
      Type.Object({
        offset: Type.Optional(Type.Number()),
        limit: Type.Optional(Type.Number()),
      }),
    ]),
    response: {
      200: Type.Object({
        filters: Type.Object({
          rentreesScolaires: Type.Array(OptionSchema),
          statuts: Type.Array(OptionSchema),
          regions: Type.Array(OptionSchema),
          academies: Type.Array(OptionSchema),
          departements: Type.Array(OptionSchema),
          communes: Type.Array(OptionSchema),
          etablissements: Type.Array(OptionSchema),
          typesDemande: Type.Array(OptionSchema),
          motifs: Type.Array(OptionSchema),
          status: Type.Array(OptionSchema),
          diplomes: Type.Array(OptionSchema),
          formations: Type.Array(OptionSchema),
          filieres: Type.Array(OptionSchema),
          familles: Type.Array(OptionSchema),
          dispositifs: Type.Array(OptionSchema),
          secteurs: Type.Array(OptionSchema),
          amiCMAs: Type.Array(OptionSchema),
          colorations: Type.Array(OptionSchema),
          compensations: Type.Array(OptionSchema),
        }),
        demandes: Type.Array(StatsDemandesItem),
        count: Type.Number(),
      }),
    },
  },
  countRestitutionIntentionsStats: {
    querystring: StatsFiltersSchema,
    response: {
      200: Type.Object({
        total: CountCapaciteStatsDemandesSchema,
        ouvertures: CountCapaciteStatsDemandesSchema,
        fermetures: CountCapaciteStatsDemandesSchema,
        amiCMAs: CountCapaciteStatsDemandesSchema,
        FCILs: CountCapaciteStatsDemandesSchema,
      }),
    },
  },
} as const;
