import { Type } from "@sinclair/typebox";

const OptionSchema = Type.Object({
  label: Type.String(),
  value: Type.String(),
});

const EtablissementLineSchema = Type.Object({
  libelleEtablissement: Type.Optional(Type.String()),
  UAI: Type.Optional(Type.String()),
  secteur: Type.Optional(Type.String()),
  commune: Type.Optional(Type.String()),
  departement: Type.Optional(Type.String()),
  codeFormationDiplome: Type.String(),
  libelleDiplome: Type.String(),
  codeNiveauDiplome: Type.String(),
  libelleOfficielFamille: Type.Optional(Type.String()),
  dispositifId: Type.Optional(Type.String()),
  libelleDispositif: Type.Optional(Type.String()),
  libelleNiveauDiplome: Type.String(),
  anneeDebut: Type.Optional(Type.Number()),
  capacite: Type.Optional(Type.Number()),
  effectif: Type.Optional(Type.Number()),
  effectif1: Type.Optional(Type.Number()),
  effectif2: Type.Optional(Type.Number()),
  effectif3: Type.Optional(Type.Number()),
  tauxPression: Type.Optional(Type.Number()),
  tauxRemplissage: Type.Optional(Type.Number()),
  premiersVoeux: Type.Optional(Type.Number()),
  tauxPoursuiteEtudes: Type.Optional(Type.Number()),
  valeurAjoutee: Type.Optional(Type.Number()),
});

const FiltersSchema = Type.Object({
  cfd: Type.Optional(Type.Array(Type.String())),
  codeRegion: Type.Optional(Type.Array(Type.String())),
  codeAcademie: Type.Optional(Type.Array(Type.String())),
  codeDepartement: Type.Optional(Type.Array(Type.String())),
  commune: Type.Optional(Type.Array(Type.String())),
  codeDiplome: Type.Optional(Type.Array(Type.String())),
  cfdFamille: Type.Optional(Type.Array(Type.String())),
  secteur: Type.Optional(Type.Array(Type.String())),
  uai: Type.Optional(Type.Array(Type.String())),
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
          familles: Type.Array(OptionSchema),
          formations: Type.Array(OptionSchema),
          etablissements: Type.Array(OptionSchema),
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
} as const;
