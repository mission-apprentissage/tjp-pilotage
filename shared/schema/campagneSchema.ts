import {z} from 'zod';

export const CampagneSchema = z.object({
  id: z.string(),
  statut: z.string(),
  dateFin: z.string().datetime(),
  dateDebut: z.string().datetime(),
  annee: z.string().regex(/^\d{4}$/),
  codeRegion: z.string().optional(),
  withSaisiePerdir: z.boolean().optional(),
  dateVote: z.string().datetime().optional(),
});

export type CampagneType = z.infer<typeof CampagneSchema>;
