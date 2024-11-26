import { z } from "zod";

import { DemandeStatutEnum } from "../../enum/demandeStatutEnum";

export const countDemandesSchema = {
  querystring: z.object({
    anneeCampagne: z.string().optional(),
    search: z.string().optional(),
    codeAcademie: z.array(z.string()).optional(),
    codeNiveauDiplome: z.array(z.string()).optional(),
  }),
  response: {
    200: z.object({
      total: z.number(),
      [DemandeStatutEnum["projet de demande"]]: z.number(),
      [DemandeStatutEnum["demande validée"]]: z.number(),
      [DemandeStatutEnum["refusée"]]: z.number(),
      [DemandeStatutEnum["brouillon"]]: z.number(),
      ["suivies"]: z.number(),
    }),
  },
};
