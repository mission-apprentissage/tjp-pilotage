import { z } from "zod";

import { DemandeStatutZodType } from "../../enum/demandeStatutEnum";
import { DemandeTypeZodType } from "../../enum/demandeTypeEnum";
import { TypeFormationSpecifiqueZodType } from "../../enum/formationSpecifiqueEnum";

const CountCapaciteStatsDemandesSchema = z.object({
  total: z.number(),
  colorationTotal: z.number().optional(),
  scolaire: z.number(),
  colorationScolaire: z.number().optional(),
  apprentissage: z.number(),
  colorationApprentissage: z.number().optional(),
});

export const FiltersSchema = z.object({
  codeRegion: z.array(z.string()).optional(),
  codeAcademie: z.array(z.string()).optional(),
  codeDepartement: z.array(z.string()).optional(),
  uai: z.array(z.string()).optional(),
  rentreeScolaire: z.string().optional(),
  typeDemande: z.array(DemandeTypeZodType).optional(),
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
  formationSpecifique: z.array(TypeFormationSpecifiqueZodType).optional(),
});

export const getStatsRestitutionIntentionsSchema = {
  querystring: FiltersSchema,
  response: {
    200: z.object({
      total: CountCapaciteStatsDemandesSchema,
      ouvertures: CountCapaciteStatsDemandesSchema,
      fermetures: CountCapaciteStatsDemandesSchema,
      certifSpecialisation: CountCapaciteStatsDemandesSchema,
      FCILs: CountCapaciteStatsDemandesSchema,
    }),
  },
};
