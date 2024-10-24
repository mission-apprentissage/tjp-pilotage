import { z } from "zod";

export const NsfOptionSchema = z.object({
  label: z.string().optional(),
  value: z.string(),
  nsf: z.string().optional(),
  type: z.enum(["nsf", "formation"]),
});

export type NsfOption = z.infer<typeof NsfOptionSchema>;

export const getDomainesDeFormationSchema = {
  querystring: z.object({
    search: z.string().trim().toLowerCase().optional(),
  }),
  response: {
    200: z.array(NsfOptionSchema),
  },
};
