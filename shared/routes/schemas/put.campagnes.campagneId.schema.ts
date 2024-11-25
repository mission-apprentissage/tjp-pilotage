import { z } from "zod";

const BodySchema = z.object({
  statut: z.string(),
  dateFin: z.string().datetime(),
  dateDebut: z.string().datetime(),
  annee: z.string().regex(/^\d{4}$/),
});

export type BodySchema = z.infer<typeof BodySchema>;

export const editCampagneSchema = {
  params: z.object({
    campagneId: z.string(),
  }),
  body: BodySchema,
  response: {
    200: z.void(),
  },
};
