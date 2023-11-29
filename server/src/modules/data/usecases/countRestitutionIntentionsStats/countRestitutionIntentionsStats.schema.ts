import { z } from "zod";

const CountCapaciteStatsDemandesSchema = z.object({
  total: z.number(),
  scolaire: z.number(),
  apprentissage: z.number(),
});

export const countRestitutionIntentionsStatsSchema = {
  querystring: z.object({
    codeRegion: z.array(z.string()).optional(),
    codeAcademie: z.array(z.string()).optional(),
    codeDepartement: z.array(z.string()).optional(),
    commune: z.array(z.string()).optional(),
    uai: z.array(z.string()).optional(),
    rentreeScolaire: z.string().optional(),
    typeDemande: z.array(z.string()).optional(),
    motif: z.array(z.string()).optional(),
    status: z.enum(["draft", "submitted"]).optional(),
    codeNiveauDiplome: z.array(z.string()).optional(),
    cfd: z.array(z.string()).optional(),
    dispositif: z.array(z.string()).optional(),
    filiere: z.array(z.string()).optional(),
    cfdFamille: z.array(z.string()).optional(),
    coloration: z.string().optional(),
    amiCMA: z.string().optional(),
    secteur: z.string().optional(),
    compensation: z.string().optional(),
    positionQuadrant: z.string().optional(),
    voie: z.enum(["scolaire", "apprentissage"]).optional(),
  }),
  response: {
    200: z.object({
      total: CountCapaciteStatsDemandesSchema,
      ouvertures: CountCapaciteStatsDemandesSchema,
      fermetures: CountCapaciteStatsDemandesSchema,
      amiCMAs: CountCapaciteStatsDemandesSchema,
      FCILs: CountCapaciteStatsDemandesSchema,
    }),
  },
};
