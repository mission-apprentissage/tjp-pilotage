import { z } from "zod";

import {DemandeStatutZodType} from '../../enum/demandeStatutEnum';
import {OrderZodType} from '../../enum/orderEnum';
import { PositionQuadrantZodType } from "../../enum/positionQuadrantEnum";
import {SecteurZodType} from '../../enum/secteurEnum';
import { FormationSpecifiqueFlagsSchema } from "../../schema/formationSpecifiqueFlagsSchema";

const FormationTransformationStatsSchema = z.object({
  libelleFormation: z.string(),
  formationSpecifique: FormationSpecifiqueFlagsSchema,
  libelleDispositif: z.string().optional(),
  tauxInsertion: z.coerce.number().optional(),
  tauxPoursuite: z.coerce.number().optional(),
  tauxDevenirFavorable: z.coerce.number().optional(),
  tauxPression: z.coerce.number().optional(),
  codeDispositif: z.string().optional(),
  cfd: z.string(),
  nbDemandes: z.coerce.number(),
  nbEtablissements: z.coerce.number(),
  effectif: z.coerce.number(),
  placesOuvertes: z.coerce.number(),
  placesFermees: z.coerce.number(),
  placesColoreesOuvertes: z.coerce.number(),
  placesColoreesFermees: z.coerce.number(),
  placesTransformees: z.coerce.number(),
  positionQuadrant: PositionQuadrantZodType.optional(),
  continuum: z
    .object({
      cfd: z.string(),
      libelleFormation: z.string().optional(),
    })
    .optional(),
});

export const FiltersSchema = z.object({
  rentreeScolaire: z.array(z.string()).optional(),
  codeNiveauDiplome: z.array(z.string()).optional(),
  codeNsf: z.array(z.string()).optional(),
  codeRegion: z.string().optional(),
  codeAcademie: z.string().optional(),
  codeDepartement: z.string().optional(),
  campagne: z.string().optional(),
  secteur: z.array(SecteurZodType).optional(),
  statut: z.array(DemandeStatutZodType.exclude(["refusée", "supprimée"])).optional(),
  coloration: z.string().optional(),
  type: z.enum(["ouverture", "fermeture", "coloration"]).optional(),
  tauxPression: z.enum(["faible", "eleve"]).optional(),
  orderFormations: OrderZodType.optional(),
  orderByFormations: FormationTransformationStatsSchema.keyof().optional(),
});

export const getFormationsPilotageSchema = {
  querystring: FiltersSchema,
  response: {
    200: z.object({
      stats: z.object({
        tauxInsertion: z.coerce.number().min(0).max(100),
        tauxPoursuite: z.coerce.number().min(0).max(100),
      }),
      formations: z.array(FormationTransformationStatsSchema),
    }),
  },
};
