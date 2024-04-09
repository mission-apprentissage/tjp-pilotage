import { z } from "zod";

export const getCurrentCampagneSchema = {
  response: {
    200: z.object({
      annee: z.string(),
      statut: z.string(),
    }),
  },
};
