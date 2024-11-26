import { z } from "zod";

export const getCurrentCampagneSchema = {
  response: {
    200: z.object({
      id: z.string(),
      annee: z.string(),
      statut: z.string(),
    }),
  },
};
