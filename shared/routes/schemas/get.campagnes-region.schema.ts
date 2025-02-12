import { z } from "zod";

const CampagneRegionSchema = z.object({
  id: z.string(),
  campagneId: z.string(),
  statut: z.string(),
  dateDebut: z.string().datetime().optional(),
  dateFin: z.string().datetime().optional(),
  dateVote: z.string().datetime().optional(),
  withSaisiePerdir: z.boolean(),
  codeRegion: z.string(),
  annee: z.string(),
  region: z.string()
});

export const getCampagnesRegionSchema = {
  response: {
    200: z.array(CampagneRegionSchema),
  },
};
