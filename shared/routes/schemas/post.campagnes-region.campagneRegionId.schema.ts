import { z } from "zod";

const CampagneRegionSchema = z.object({
  statut: z.string(),
  dateFin: z.string().datetime(),
  dateDebut: z.string().datetime(),
  campagneId: z.string(),
  codeRegion: z.string(),
  withSaisiePerdir: z.boolean(),
});

export type CampagneRegionSchema = z.infer<typeof CampagneRegionSchema>;

export const createCampagneRegionSchema = {
  body: CampagneRegionSchema,
  response: {
    200: z.void(),
  },
};
