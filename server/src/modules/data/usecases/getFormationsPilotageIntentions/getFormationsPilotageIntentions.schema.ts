import { DemandeStatutZodType } from "shared/enum/demandeStatutEnum";
import { SecteurZodType } from "shared/enum/secteurEnum";
import { z } from "zod";

const FormationTransformationStatsSchema = z.object({
  libelleFormation: z.string().optional(),
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
  positionQuadrant: z.string().optional(),
  continuum: z
    .object({
      cfd: z.string(),
      libelleFormation: z.string().optional(),
    })
    .optional(),
});

export const getFormationsPilotageIntentionsSchema = {
  querystring: z.object({
    rentreeScolaire: z.array(z.string()).optional(),
    codeNiveauDiplome: z.array(z.string()).optional(),
    codeNsf: z.array(z.string()).optional(),
    codeRegion: z.string().optional(),
    codeAcademie: z.string().optional(),
    codeDepartement: z.string().optional(),
    statut: z
      .array(DemandeStatutZodType.exclude(["refusée", "supprimée"]))
      .optional(),
    CPC: z.array(z.string()).optional(),
    secteur: z.array(SecteurZodType).optional(),
    type: z.enum(["ouverture", "fermeture", "coloration"]).optional(),
    tauxPression: z.enum(["faible", "eleve"]).optional(),
    campagne: z.string().optional(),
    withColoration: z.string().optional(),
    order: z.enum(["asc", "desc"]).optional(),
    orderBy: FormationTransformationStatsSchema.keyof().optional(),
  }),
  response: {
    200: z.object({
      stats: z.object({
        tauxInsertion: z.coerce.number(),
        tauxPoursuite: z.coerce.number(),
      }),
      formations: z.array(FormationTransformationStatsSchema),
    }),
  },
};
