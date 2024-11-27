import { z } from "zod";

const typeSchema = z.object({
  label: z.string(),
  color: z.string(),
});

export const changelogEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  deployed: z.boolean(),
  types: z.array(typeSchema),
  date: z.object({
    type: z.literal("date").or(z.literal("string")),
    value: z.string(),
  }),
  description: z.string(),
  document: z.string().optional(),
  show: z.boolean(),
});

export type ChangelogEntry = z.infer<typeof changelogEntrySchema>;
export type Changelog = Array<ChangelogEntry>;

export const getChangelogSchema = {
  response: {
    200: z.array(changelogEntrySchema),
  },
};
