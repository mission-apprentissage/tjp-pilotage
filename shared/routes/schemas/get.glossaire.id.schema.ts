import { z } from "zod";

export const entryIndicatorSchema = z.object({
  name: z.string(),
  color: z.string(),
});

export const entrySchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  indicator: entryIndicatorSchema.optional(),
  status: z.string().optional(),
  icon: z.string().optional(),
  content: z.string().optional(),
});

export type GlossaireEntryIndicator = z.infer<typeof entryIndicatorSchema>;
export type GlossaireEntry = z.infer<typeof entrySchema>;

export const getGlossaireEntrySchema = {
  params: z.object({
    id: z.string(),
  }),
  response: {
    200: entrySchema,
  },
};
