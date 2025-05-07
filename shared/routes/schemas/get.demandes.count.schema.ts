import { z } from "zod";

import { DemandeStatutEnum } from "../../enum/demandeStatutEnum";

export const FiltersSchema = z.object({
  campagne: z.string().optional(),
  search: z.string().optional(),
  codeAcademie: z.array(z.string()).optional(),
  codeNiveauDiplome: z.array(z.string()).optional(),
});

export const countDemandesSchema = {
  querystring: FiltersSchema,
  response: {
    200: z.object({
      total: z.number(),
      [DemandeStatutEnum["proposition"]]: z.number(),
      [DemandeStatutEnum["projet de demande"]]: z.number(),
      [DemandeStatutEnum["demande validée"]]: z.number(),
      [DemandeStatutEnum["refusée"]]: z.number(),
      [DemandeStatutEnum["brouillon"]]: z.number(),
      [DemandeStatutEnum["dossier complet"]]: z.number(),
      [DemandeStatutEnum["dossier incomplet"]]: z.number(),
      [DemandeStatutEnum["prêt pour le vote"]]: z.number(),
      suivies: z.number(),
    }),
  },
};
