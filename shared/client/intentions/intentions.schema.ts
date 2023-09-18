import { Type } from "@sinclair/typebox";

import { Partial } from "../utils";

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
  coloration: Type.Boolean(),
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
  coloration: Type.Optional(Type.Boolean()),
  amiCma: Type.Optional(Type.Boolean()),
  poursuitePedagogique: Type.Optional(Type.Boolean()),
  commentaire: Type.Optional(Type.String()),
  status: Type.String(),
});

const SubmitSchemaPost = Type.Omit(
  Partial(DemandeSchema, ["id", "autreMotif", "commentaire"]),
  ["status", "createdAt"]
);

const MetadataSchema = Type.Object({
  etablissement: Type.Optional(
    Type.Object({
      libelle: Type.Optional(Type.String()),
      commune: Type.Optional(Type.String()),
    })
  ),
  formation: Type.Optional(
    Type.Object({
      libelle: Type.Optional(Type.String()),
      dispositifs: Type.Array(
        Type.Object({
          codeDispositif: Type.String(),
          libelleDispositif: Type.String(),
        })
      ),
    })
  ),
  libelleDiplome: Type.Optional(Type.String()),
});

const DraftSchemaPost = Partial(SubmitSchemaPost, [
  "id",
  "uai",
  "cfd",
  "libelleDiplome",
  "rentreeScolaire",
  "typeDemande",
  "motif",
  "autreMotif",
  "libelleColoration",
  "amiCma",
  "poursuitePedagogique",
  "commentaire",
  "dispositifId",
  "coloration",
]);

const FiltersSchema = Type.Object({
  status: Type.Optional(
    Type.Union([Type.Literal("draft"), Type.Literal("submitted")])
  ),
  order: Type.Optional(Type.Union([Type.Literal("asc"), Type.Literal("desc")])),
  orderBy: Type.Optional(
    Type.Union([
      Type.KeyOf(Type.Omit(DraftSchema, [])),
      Type.KeyOf(Type.Omit(DemandeSchema, [])),
    ])
  ),
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
  searchEtab: {
    params: Type.Object({
      search: Type.String(),
    }),
    response: {
      200: Type.Array(
        Type.Object({
          value: Type.String(),
          label: Type.Optional(Type.String()),
          commune: Type.Optional(Type.String()),
        })
      ),
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
  searchDiplome: {
    params: Type.Object({
      search: Type.String(),
    }),
    response: {
      200: Type.Array(
        Type.Object({
          value: Type.String(),
          label: Type.String(),
          isFamille: Type.Boolean(),
          isSecondeCommune: Type.Boolean(),
          dateFermeture: Type.String(),
          dispositifs: Type.Array(
            Type.Object({
              libelleDispositif: Type.String(),
              codeDispositif: Type.String(),
            })
          ),
        })
      ),
    },
  },
  submitDemande: {
    body: Type.Object({
      demande: SubmitSchemaPost,
    }),
    response: {
      200: Type.Undefined(),
    },
  },
  submitDraftDemande: {
    body: Type.Object({
      demande: DraftSchemaPost,
    }),
    response: {
      200: Type.Undefined(),
    },
  },
  getDemande: {
    params: Type.Object({ id: Type.String() }),
    response: {
      200: Type.Union([
        Type.Intersect([
          DemandeSchema,
          Type.Object({ metadata: MetadataSchema }),
        ]),
        Type.Intersect([
          DraftSchema,
          Type.Object({ metadata: MetadataSchema }),
        ]),
      ]),
    },
  },
  getDemandes: {
    querystring: Type.Intersect([
      FiltersSchema,
      Type.Object({
        offset: Type.Optional(Type.Number()),
        limit: Type.Optional(Type.Number()),
      }),
    ]),
    response: {
      200: Type.Object({
        demandes: Type.Array(
          Type.Object({
            id: Type.String(),
            cfd: Type.Optional(Type.String()),
            libelleDiplome: Type.Optional(Type.String()),
            uai: Type.Optional(Type.String()),
            createdAt: Type.String(),
            createurId: Type.String(),
            status: Type.String(),
          })
        ),
        count: Type.Number(),
      }),
    },
  },
  getDemandesCsv: {
    produces: ["text/csv"] as string[],
    querystring: FiltersSchema,
    response: {
      200: Type.String(),
    },
  },
  countDemandes: {
    response: {
      200: Type.Object({
        total: Type.String(),
        draft: Type.String(),
        submitted: Type.String(),
      }),
    },
  },
} as const;
