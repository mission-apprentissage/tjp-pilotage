import { Type } from "@sinclair/typebox";

const statsSortieSchema = Type.Object({
  tauxPoursuiteEtudes: Type.Optional(Type.Number()),
  tauxInsertion6mois: Type.Optional(Type.Number()),
});

const statsSchema = Type.Object({
  effectif: Type.Optional(Type.Number()),
  nbFormations: Type.Optional(Type.Number()),
  nbEtablissements: Type.Optional(Type.Number()),
  statsSortie: Type.Object({
    anneeEnCours: statsSortieSchema,
    anneePrecedente: statsSortieSchema,
  }),
});

export const pilotageReformeSchemas = {
  getPilotageReformeStats: {
    querystring: Type.Object({
      codeRegion: Type.Optional(Type.String()),
      codeNiveauDiplome: Type.Optional(Type.Array(Type.String())),
      libelleFiliere: Type.Optional(Type.Array(Type.String())),
      millesimeSortie: Type.String(),
      rentreeScolaire: Type.String(),
    }),
    response: {
      200: Type.Object({
        nationale: statsSchema,
        filtered: statsSchema,
      }),
    },
  },
} as const;
