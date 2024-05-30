import { z } from "zod";

export const getIntentionFileDownloadUrlSchema = {
  params: z.object({
    numero: z.string(),
  }),
  querystring: z.object({
    filename: z.string(),
  }),
  response: {
    200: z.object({
      url: z.string(),
    }),
  },
};
