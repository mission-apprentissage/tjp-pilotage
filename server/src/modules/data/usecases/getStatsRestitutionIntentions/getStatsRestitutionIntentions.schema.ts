import { DemandeStatutZodType } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

const CountCapaciteStatsDemandesSchema = z.object({
  total: z.number(),
  scolaire: z.number(),
  apprentissage: z.number(),
});

export const FiltersSchema = z.object({
  codeRegion: z.array(z.string()).optional(),
  codeAcademie: z.array(z.string()).optional(),
  codeDepartement: z.array(z.string()).optional(),
  uai: z.array(z.string()).optional(),
  rentreeScolaire: z.string().optional(),
  typeDemande: z.array(z.string()).optional(),
  statut: z.array(DemandeStatutZodType.exclude(["supprimée"])).optional(),
  codeNiveauDiplome: z.array(z.string()).optional(),
  cfd: z.array(z.string()).optional(),
  coloration: z.string().optional(),
  amiCMA: z.string().optional(),
  secteur: z.string().optional(),
  positionQuadrant: z.string().optional(),
  voie: z.enum(["scolaire", "apprentissage"]).optional(),
  codeNsf: z.array(z.string()).optional(),
  campagne: z.string().optional(),
  search: z.string().optional(),
});

export const getStatsRestitutionIntentionsSchema = {
  querystring: FiltersSchema,
  response: {
    200: z.object({
      total: CountCapaciteStatsDemandesSchema,
      ouvertures: CountCapaciteStatsDemandesSchema,
      fermetures: CountCapaciteStatsDemandesSchema,
      coloration: CountCapaciteStatsDemandesSchema,
      certifSpecialisation: CountCapaciteStatsDemandesSchema,
      FCILs: CountCapaciteStatsDemandesSchema,
    }),
  },
};
