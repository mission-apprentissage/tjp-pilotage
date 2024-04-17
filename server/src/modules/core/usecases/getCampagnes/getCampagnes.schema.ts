import { z } from "zod";

const CampagneSchema = z.object({
  id: z.string(),
  annee: z.string(),
  statut: z.string(),
  dateDebut: z.string().datetime().optional(),
  dateFin: z.string().datetime().optional(),
});

export const getCampagnesSchema = {
  response: {
    200: z.array(CampagneSchema),
  },
};
