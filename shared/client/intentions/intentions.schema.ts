import { Type } from "@sinclair/typebox";

const DemandeSchema = Type.Object({
  id: Type.String(),
  createdAt: Type.String(),
  uai: Type.String(),
  cfd: Type.String(),
  libelleDiplome: Type.String(),
  dispositifId: Type.String(),
  rentreeScolaire: Type.Number(),
  typeDemande: Type.String(),
  motif: Type.Array(Type.String()),
  autreMotif: Type.Optional(Type.String()),
  libelleColoration: Type.Optional(Type.String()),
  amiCma: Type.Boolean(),
  poursuitePedagogique: Type.Boolean(),
  commentaire: Type.Optional(Type.String()),
  status: Type.String(),
});

const DraftSchema = Type.Object({
  id: Type.String(),
  createdAt: Type.String(),
  uai: Type.Optional(Type.String()),
  cfd: Type.Optional(Type.String()),
  libelleDiplome: Type.Optional(Type.String()),
  dispositifId: Type.Optional(Type.String()),
  rentreeScolaire: Type.Optional(Type.Number()),
  typeDemande: Type.Optional(Type.String()),
  motif: Type.Optional(Type.Array(Type.String())),
  autreMotif: Type.Optional(Type.String()),
  libelleColoration: Type.Optional(Type.String()),
  amiCma: Type.Optional(Type.Boolean()),
  poursuitePedagogique: Type.Optional(Type.Boolean()),
  commentaire: Type.Optional(Type.String()),
  status: Type.String(),
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
  checkCfd: {
    params: Type.Object({
      cfd: Type.String(),
    }),
    response: {
      200: Type.Union([
        Type.Object({
          status: Type.Union([Type.Literal("valid")]),
          data: Type.Object({
            cfd: Type.String(),
            libelle: Type.Optional(Type.String()),
            dispositifs: Type.Array(
              Type.Object({
                codeDispositif: Type.String(),
                libelleDispositif: Type.String(),
              })
            ),
          }),
        }),
        Type.Object({
          status: Type.Union([Type.Literal("wrong_format")]),
        }),
        Type.Object({
          status: Type.Union([Type.Literal("not_found")]),
        }),
      ]),
    },
  },
  submitDemande: {
    body: Type.Object({
      demande: Type.Omit(DemandeSchema, ["id", "createdAt", "status"]),
    }),
    response: {
      200: Type.Undefined(),
    },
  },
  getDemande: {
    params: Type.Object({ id: Type.String() }),
    response: {
      200: Type.Union([DemandeSchema, DraftSchema]),
    },
  },
  getDemandes: {
    response: {
      200: Type.Array(
        Type.Object({
          id: Type.String(),
          createdAt: Type.String(),
          createurId: Type.String(),
          status: Type.String(),
        })
      ),
    },
  },
} as const;
