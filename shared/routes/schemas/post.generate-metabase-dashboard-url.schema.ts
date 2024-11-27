import { z } from "zod";

export const getMetabaseDashboardUrlSchema = {
  body: z.object({
    dashboard: z.number(),
    filters: z.record(z.string(), z.union([z.string(), z.null()])),
  }),
  response: {
    200: z.object({
      url: z.string(),
    }),
  },
};
