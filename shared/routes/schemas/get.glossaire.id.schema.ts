import { z } from "zod";

export const entryIndicatorSchema = z.object({
  name: z.string(),
  color: z.string(),
});

export const entrySchema = z.object({
  slug: z.string(),
  title: z.string(),
  type: z.string().optional(),
  createdBy: z.string().optional(),
  status: z.string().optional(),
  icon: z.string().optional(),
  content: z.string().optional(),
});


export type GlossaireEntryIndicator = z.infer<typeof entryIndicatorSchema>;
export type GlossaireEntry = z.infer<typeof entrySchema>;

export const getGlossaireEntrySchema = {
  params: z.object({
    slug: z.string(),
  }),
  response: {
    200: entrySchema,
  },
};
