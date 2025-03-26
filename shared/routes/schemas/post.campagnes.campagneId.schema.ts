import { z } from "zod";


const CampagneSchema = z.object({
  annee: z.string().regex(/^\d{4}$/),
  statut: z.string(),
  dateFin: z.string().datetime(),
  dateDebut: z.string().datetime(),
});

export const createCampagneSchema = {
  body: CampagneSchema,
  response: {
    200: z.void(),
  },
};
