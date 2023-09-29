import { Type } from "@sinclair/typebox";

const DemandeData = Type.Object({
  uai: Type.String(),
  cfd: Type.String(),
  dispositifId: Type.String(),
  libelleFCIL: Type.Optional(Type.String()),
  rentreeScolaire: Type.Number(),
  typeDemande: Type.String(),
  compensationUai: Type.Optional(Type.String()),
  compensationCfd: Type.Optional(Type.String()),
  compensationDispositifId: Type.Optional(Type.String()),
  compensationRentreeScolaire: Type.Optional(Type.Number()),
  motif: Type.Array(Type.String()),
  autreMotif: Type.Optional(Type.String()),
  libelleColoration: Type.Optional(Type.String()),
  coloration: Type.Boolean(),
  amiCma: Type.Boolean(),
  poursuitePedagogique: Type.Optional(Type.Boolean()),
  commentaire: Type.Optional(Type.String()),
  mixte: Type.Optional(Type.Boolean()),
  capaciteScolaireActuelle: Type.Optional(Type.Number()),
  capaciteScolaire: Type.Optional(Type.Number()),
  capaciteScolaireColoree: Type.Optional(Type.Number()),
  capaciteApprentissageActuelle: Type.Optional(Type.Number()),
  capaciteApprentissage: Type.Optional(Type.Number()),
  capaciteApprentissageColoree: Type.Optional(Type.Number()),
});

const DemandeSchema = Type.Object({
  id: Type.String(),
  createdAt: Type.String(),
  status: Type.String(),
  ...DemandeData.properties,
});

const EtablissementMetadataSchema = Type.Optional(
  Type.Object({
    libelle: Type.Optional(Type.String()),
    commune: Type.Optional(Type.String()),
  })
);

const FormationMetadataSchema = Type.Optional(
  Type.Object({
    libelle: Type.Optional(Type.String()),
    isFCIL: Type.Optional(Type.Boolean()),
    dispositifs: Type.Optional(
      Type.Array(
        Type.Object({
          codeDispositif: Type.Optional(Type.String()),
          libelleDispositif: Type.Optional(Type.String()),
        })
      )
    ),
  })
);

const MetadataSchema = Type.Object({
  etablissement: EtablissementMetadataSchema,
  formation: FormationMetadataSchema,
  etablissementCompensation: EtablissementMetadataSchema,
  formationCompensation: FormationMetadataSchema,
});

const DemandesItem = Type.Object({
  id: Type.String(),
  cfd: Type.Optional(Type.String()),
  libelleDiplome: Type.Optional(Type.String()),
  libelleEtablissement: Type.Optional(Type.String()),
  libelleDispositif: Type.Optional(Type.String()),
  libelleFCIL: Type.Optional(Type.String()),
  uai: Type.Optional(Type.String()),
  createdAt: Type.String(),
  createurId: Type.String(),
  status: Type.String(),
  typeDemande: Type.Optional(Type.String()),
  compensationCfd: Type.Optional(Type.String()),
  compensationDispositifId: Type.Optional(Type.String()),
  compensationUai: Type.Optional(Type.String()),
  compensationRentreeScolaire: Type.Optional(Type.Number()),
  idCompensation: Type.Optional(Type.String()),
  typeCompensation: Type.Optional(Type.String()),
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
  getEtab: {
    params: Type.Object({
      uai: Type.String(),
    }),
    response: {
      200: Type.Object({
        value: Type.String(),
        label: Type.Optional(Type.String()),
        commune: Type.Optional(Type.String()),
      }),
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
          isSpecialite: Type.Boolean(),
          isFCIL: Type.Boolean(),
          dateFermeture: Type.String(),
          dispositifs: Type.Optional(
            Type.Array(
              Type.Object({
                codeDispositif: Type.Optional(Type.String()),
                libelleDispositif: Type.Optional(Type.String()),
              })
            )
          ),
        })
      ),
    },
  },
  submitDemande: {
    body: Type.Object({
      demande: Type.Object({
        id: Type.Optional(Type.String()),
        ...DemandeData.properties,
      }),
    }),
    response: {
      200: Type.Object({ id: Type.String() }),
    },
  },
  submitDraftDemande: {
    body: Type.Object({
      demande: Type.Object({
        id: Type.Optional(Type.String()),
        ...DemandeData.properties,
      }),
    }),
    response: {
      200: Type.Object({ id: Type.String() }),
    },
  },
  getDemande: {
    params: Type.Object({ id: Type.String() }),
    response: {
      200: Type.Object({
        ...Type.Partial(DemandeSchema).properties,
        ...Type.Object({ metadata: MetadataSchema }).properties,
        ...Type.Object({ canEdit: Type.Boolean() }).properties,
      }),
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
