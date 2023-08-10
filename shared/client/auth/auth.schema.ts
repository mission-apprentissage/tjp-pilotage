import { Type } from "@sinclair/typebox";

import { passwordRegex } from "../../utils/passwordRegex";

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

export const authSchemas = {
  login: {
    body: Type.Object({
      email: Type.String(),
      password: Type.String(),
    }),
    response: {
      200: Type.Object({
        token: Type.String(),
      }),
    },
  },
  logout: {
    response: {
      200: Type.Void(),
    },
  },
  whoAmI: {
    response: {
      200: Type.Object({
        user: Type.Object({
          id: Type.String(),
          email: Type.String(),
          role: Type.Optional(Type.Union([Type.Literal("admin")])),
        }),
      }),
      401: Type.Void(),
    },
  },
  activateUser: {
    body: Type.Object({
      password: Type.String({
        pattern: passwordRegex,
      }),
      repeatPassword: Type.String(),
      activationToken: Type.String(),
    }),
    response: {
      200: Type.Object({
        token: Type.String(),
      }),
    },
  },
  "send-reset-password": {
    body: Type.Object({
      email: Type.String(),
    }),
    response: {
      200: Type.Undefined(),
    },
  },
} as const;
