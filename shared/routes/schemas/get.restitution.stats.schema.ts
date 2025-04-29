import { z } from "zod";

import { DemandeStatutZodType } from "../../enum/demandeStatutEnum";
import { TypeFormationSpecifiqueZodType } from "../../enum/formationSpecifiqueEnum";
import {VoieZodType} from '../../enum/voieEnum';

const CountCapaciteStatsSchema = z.object({
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
  voie: VoieZodType.optional(),
  codeNsf: z.array(z.string()).optional(),
  campagne: z.string().optional(),
  search: z.string().optional(),
  formationSpecifique: z.array(TypeFormationSpecifiqueZodType).optional(),
});

export const getStatsRestitutionSchema = {
  querystring: FiltersSchema,
  response: {
    200: z.object({
      total: CountCapaciteStatsSchema,
      ouvertures: CountCapaciteStatsSchema,
      fermetures: CountCapaciteStatsSchema,
      ouverturesColorations: CountCapaciteStatsSchema,
      fermeturesColorations: CountCapaciteStatsSchema,
    }),
  },
};
