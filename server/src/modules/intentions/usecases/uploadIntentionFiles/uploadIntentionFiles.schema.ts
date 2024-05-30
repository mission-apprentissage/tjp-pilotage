import { z } from "zod";

export const uploadIntentionFilesSchema = {
  body: z.any(),
  params: z.object({
    numero: z.string(),
  }),
  response: {
    200: z.void(),
  },
};
