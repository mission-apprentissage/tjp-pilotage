import { Type } from "@sinclair/typebox";

const OptionSchema = Type.Object({
  label: Type.String(),
  value: Type.String(),
});

const EtablissementLineSchema = Type.Object({
  libelleEtablissement: Type.Optional(Type.String()),
  UAI: Type.String(),
  rentreeScolaire: Type.Optional(Type.String()),
  secteur: Type.Optional(Type.String()),
  commune: Type.Optional(Type.String()),
  departement: Type.Optional(Type.String()),
  codeFormationDiplome: Type.String(),
  libelleDiplome: Type.String(),
  codeNiveauDiplome: Type.String(),
  libelleOfficielFamille: Type.Optional(Type.String()),
  dispositifId: Type.Optional(Type.String()),
  libelleDispositif: Type.Optional(Type.String()),
  libelleNiveauDiplome: Type.Optional(Type.String()),
  anneeDebut: Type.Optional(Type.Number()),
  capacite: Type.Optional(Type.Number()),
  effectif: Type.Optional(Type.Number()),
  effectif1: Type.Optional(Type.Number()),
  effectif2: Type.Optional(Type.Number()),
  effectif3: Type.Optional(Type.Number()),
  tauxPression: Type.Optional(Type.Number()),
  tauxRemplissage: Type.Optional(Type.Number()),
  tauxPoursuiteEtudes: Type.Optional(Type.Number()),
  tauxInsertion6mois: Type.Optional(Type.Number()),
  valeurAjoutee: Type.Optional(Type.Number()),
  CPC: Type.Optional(Type.String()),
  CPCSecteur: Type.Optional(Type.String()),
  CPCSousSecteur: Type.Optional(Type.String()),
  libelleFiliere: Type.Optional(Type.String()),
  continuum: Type.Optional(Type.Any()),
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
  secteur: Type.Optional(Type.Array(Type.String())),
  uai: Type.Optional(Type.Array(Type.String())),
  CPC: Type.Optional(Type.Array(Type.String())),
  CPCSecteur: Type.Optional(Type.Array(Type.String())),
  CPCSousSecteur: Type.Optional(Type.Array(Type.String())),
  libelleFiliere: Type.Optional(Type.Array(Type.String())),
  order: Type.Optional(Type.Union([Type.Literal("asc"), Type.Literal("desc")])),
  orderBy: Type.Optional(Type.KeyOf(Type.Omit(EtablissementLineSchema, []))),
});

export const etablissementSchemas = {
  getEtablissements: {
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
          etablissements: Type.Array(OptionSchema),
          CPCs: Type.Array(OptionSchema),
          CPCSecteurs: Type.Array(OptionSchema),
          CPCSousSecteurs: Type.Array(OptionSchema),
          libelleFilieres: Type.Array(OptionSchema),
        }),
        etablissements: Type.Array(EtablissementLineSchema),
      }),
    },
  },
  getEtablissementsCsv: {
    produces: ["text/csv"] as string[],
    querystring: FiltersSchema,
    response: {
      200: Type.String(),
    },
  },
  getEtablissement: {
    params: Type.Object({ uai: Type.String() }),
    response: {
      200: Type.Object({
        uai: Type.String(),
        rentreeScolaire: Type.String(),
        libelleEtablissement: Type.Optional(Type.String()),
        valeurAjoutee: Type.Optional(Type.Number()),
        codeRegion: Type.Optional(Type.String()),
        libelleRegion: Type.Optional(Type.String()),
        formations: Type.Array(
          Type.Object({
            cfd: Type.String(),
            codeNiveauDiplome: Type.String(),
            libelleDiplome: Type.String(),
            dispositifId: Type.Optional(Type.String()),
            libelleDispositif: Type.Optional(Type.String()),
            libelleNiveauDiplome: Type.Optional(Type.String()),
            effectif: Type.Optional(Type.Number()),
            tauxPression: Type.Optional(Type.Number()),
            tauxInsertion6mois: Type.Optional(Type.Number()),
            tauxPoursuiteEtudes: Type.Optional(Type.Number()),
            CPC: Type.Optional(Type.String()),
            CPCSecteur: Type.Optional(Type.String()),
            CPCSousSecteur: Type.Optional(Type.String()),
            libelleFiliere: Type.Optional(Type.String()),
          })
        ),
      }),
    },
  },
  getRegionStats: {
    params: Type.Object({
      codeRegion: Type.String(),
    }),
    querystring: Type.Object({
      codeDiplome: Type.Optional(Type.Array(Type.String())),
    }),
    response: {
      200: Type.Object({
        libelleRegion: Type.String(),
        effectif: Type.Number(),
        nbFormations: Type.Number(),
        tauxPression: Type.Optional(Type.Number()),
        tauxRemplissage: Type.Optional(Type.Number()),
        tauxPoursuiteEtudes: Type.Optional(Type.Number()),
        tauxInsertion6mois: Type.Optional(Type.Number()),
      }),
    },
  },
} as const;
