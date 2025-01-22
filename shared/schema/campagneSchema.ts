import {z} from 'zod';

export const CampagneSchema = z.object({
  id: z.string(),
  statut: z.string(),
  dateFin: z.string().datetime(),
  dateDebut: z.string().datetime(),
  annee: z.string().regex(/^\d{4}$/),
});

export type CampagneSchema = z.infer<typeof CampagneSchema>;
