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
  tauxInsertion: Type.Optional(Type.Number()),
  tauxPoursuite: Type.Optional(Type.Number()),
  tauxDevenirFavorable: Type.Optional(Type.Number()),
  CPC: Type.Optional(Type.String()),
  CPCSecteur: Type.Optional(Type.String()),
  CPCSousSecteur: Type.Optional(Type.String()),
  libelleFiliere: Type.Optional(Type.String()),
  continuum: Type.Optional(
    Type.Object({
      cfd: Type.String(),
      libelle: Type.Optional(Type.String()),
    })
  ),
  positionQuadrant: Type.Optional(Type.String()),
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
  CPC: Type.Optional(Type.Array(Type.String())),
  CPCSecteur: Type.Optional(Type.Array(Type.String())),
  CPCSousSecteur: Type.Optional(Type.Array(Type.String())),
  libelleFiliere: Type.Optional(Type.Array(Type.String())),
  order: Type.Optional(Type.Union([Type.Literal("asc"), Type.Literal("desc")])),
  orderBy: Type.Optional(Type.KeyOf(FormationLineSchema)),
  withEmptyFormations: Type.Optional(Type.Boolean()),
});

const FormationSchema = Type.Object({
  codeFormationDiplome: Type.String(),
  libelleDiplome: Type.String(),
  codeNiveauDiplome: Type.String(),
  libelleNiveauDiplome: Type.Optional(Type.String()),
  dispositifId: Type.Optional(Type.String()),
  libelleDispositif: Type.Optional(Type.String()),
  nbEtablissement: Type.Number(),
  effectif: Type.Optional(Type.Number()),
  effectifPrecedent: Type.Optional(Type.Number()),
  tauxRemplissage: Type.Optional(Type.Number()),
  tauxPression: Type.Optional(Type.Number()),
  tauxInsertion: Type.Number(),
  tauxInsertionPrecedent: Type.Optional(Type.Number()),
  tauxPoursuite: Type.Number(),
  tauxPoursuitePrecedent: Type.Optional(Type.Number()),
  tauxDevenirFavorable: Type.Number(),
  positionQuadrant: Type.Optional(Type.String()),
  CPC: Type.Optional(Type.String()),
  CPCSecteur: Type.Optional(Type.String()),
  CPCSousSecteur: Type.Optional(Type.String()),
  libelleFiliere: Type.Optional(Type.String()),
  continuum: Type.Optional(
    Type.Object({
      cfd: Type.String(),
      libelle: Type.Optional(Type.String()),
    })
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
          CPCs: Type.Array(OptionSchema),
          CPCSecteurs: Type.Array(OptionSchema),
          CPCSousSecteurs: Type.Array(OptionSchema),
          libelleFilieres: Type.Array(OptionSchema),
        }),
        formations: Type.Array(FormationLineSchema),
      }),
    },
  },
  getDataForPanoramaRegion: {
    querystring: Type.Object({
      codeRegion: Type.String(),
      codesNiveauxDiplomes: Type.Optional(Type.Array(Type.String())),
      libellesFilieres: Type.Optional(Type.Array(Type.String())),
      order: Type.Optional(Type.Union([Type.Literal("asc"), Type.Literal("desc")])),
      orderBy: Type.Optional(Type.KeyOf(FormationSchema)),
    }),
    response: {
      200: Type.Object({
        formations: Type.Array(FormationSchema),
        filters: Type.Object({
          diplomes: Type.Array(OptionSchema),
          filieres: Type.Array(OptionSchema),
        })
      }),
    },
  },
  getDataForPanoramaDepartement: {
    querystring: Type.Object({
      codeDepartement: Type.String(),
      codesNiveauxDiplomes: Type.Optional(Type.Array(Type.String())),
      libellesFilieres: Type.Optional(Type.Array(Type.String())),
      order: Type.Optional(Type.Union([Type.Literal("asc"), Type.Literal("desc")])),
      orderBy: Type.Optional(Type.KeyOf(FormationSchema)),
    }),
    response: {
      200: Type.Object({
        formations: Type.Array(FormationSchema),
        filters: Type.Object({
          diplomes: Type.Array(OptionSchema),
          filieres: Type.Array(OptionSchema),
        })
      }),
    },
  },
  getRegions: {
    response: {
      200: Type.Array(OptionSchema),
    },
  },
  getDepartements: {
    response: {
      200: Type.Array(OptionSchema),
    },
  },
} as const;
