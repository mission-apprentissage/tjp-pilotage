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

export const intentionsSchemas = {
  checkUai: {
    params: Type.Object({
      uai: Type.String(),
    }),
    response: {
      200: Type.Union([
        Type.Object({
          status: Type.Union([Type.Literal("valid")]),
          data: Type.Object({
            uai: Type.String(),
            libelle: Type.Optional(Type.String()),
            codeRegion: Type.Optional(Type.String()),
            codeAcademie: Type.Optional(Type.String()),
            codeDepartement: Type.Optional(Type.String()),
            commune: Type.Optional(Type.String()),
            secteur: Type.Optional(Type.String()),
            adresse: Type.Optional(Type.String()),
          }),
        }),
        Type.Object({
          status: Type.Union([Type.Literal("wrong_format")]),
          suggestions: Type.Array(
            Type.Object({
              uai: Type.String(),
              commune: Type.String(),
              libelle: Type.String(),
            })
          ),
        }),
        Type.Object({
          status: Type.Union([Type.Literal("not_found")]),
        }),
      ]),
    },
  },
} as const;
