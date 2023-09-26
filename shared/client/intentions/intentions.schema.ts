import { Type } from "@sinclair/typebox";

import { Partial } from "../utils";

const DemandeSchema = Type.Object({
  id: Type.String(),
  createdAt: Type.String(),
  uai: Type.String(),
  cfd: Type.String(),
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
  mixte: Type.Boolean(),
  capaciteScolaireActuelle: Type.Optional(Type.Number()),
  capaciteScolaire: Type.Number(),
  capaciteScolaireColoree: Type.Optional(Type.Number()),
  capaciteApprentissageActuelle: Type.Optional(Type.Number()),
  capaciteApprentissage: Type.Optional(Type.Number()),
  capaciteApprentissageColoree: Type.Optional(Type.Number()),
});

const DraftSchema = Type.Object({
  id: Type.String(),
  createdAt: Type.String(),
  uai: Type.String(),
  cfd: Type.Optional(Type.String()),
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
  mixte: Type.Optional(Type.Boolean()),
  capaciteScolaireActuelle: Type.Optional(Type.Number()),
  capaciteScolaire: Type.Optional(Type.Number()),
  capaciteScolaireColoree: Type.Optional(Type.Number()),
  capaciteApprentissageActuelle: Type.Optional(Type.Number()),
  capaciteApprentissage: Type.Optional(Type.Number()),
  capaciteApprentissageColoree: Type.Optional(Type.Number()),
});

const SubmitSchemaPost = Type.Omit(Partial(DemandeSchema, ["id"]), [
  "status",
  "createdAt",
]);

const DraftSchemaPost = Partial(DraftSchema, ["id", "status", "createdAt"]);

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
});

const DemandesItem = Type.Object({
  id: Type.String(),
  cfd: Type.Optional(Type.String()),
  libelleDiplome: Type.Optional(Type.String()),
  uai: Type.Optional(Type.String()),
  createdAt: Type.String(),
  createurId: Type.String(),
  status: Type.String(),
});

const FiltersSchema = Type.Object({
  status: Type.Optional(
    Type.Union([Type.Literal("draft"), Type.Literal("submitted")])
  ),
  order: Type.Optional(Type.Union([Type.Literal("asc"), Type.Literal("desc")])),
  orderBy: Type.Optional(Type.KeyOf(DemandesItem)),
});

export const intentionsSchemas = {
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
      200: Type.Object({ id: Type.String() }),
    },
  },
  getDemande: {
    params: Type.Object({ id: Type.String() }),
    response: {
      200: Type.Union([
        Type.Intersect([
          DemandeSchema,
          Type.Object({ metadata: MetadataSchema }),
          Type.Object({ canEdit: Type.Boolean() }),
        ]),
        Type.Intersect([
          DraftSchema,
          Type.Object({ metadata: MetadataSchema }),
          Type.Object({ canEdit: Type.Boolean() }),
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
        demandes: Type.Array(DemandesItem),
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
