import { z } from "zod";

export const entrySchema = z.object({
  slug: z.string(),
  title: z.string(),
  type: z.string().optional(),
  createdBy: z.string().optional(),
  status: z.string().optional(),
  icon: z.string().optional(),
});

export type GlossaireEntry = z.infer<typeof entrySchema>;

export const getGlossaireSchema = {
  response: {
    200: z.array(entrySchema),
  },
};
