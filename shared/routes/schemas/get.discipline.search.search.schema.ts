import { z } from "zod";

export const searchDisciplineSchema = {
  params: z.object({
    search: z.string(),
  }),
  response: {
    200: z.array(
      z.object({
        value: z.string().optional(),
        label: z.string().optional(),
      })
    ),
  },
};
