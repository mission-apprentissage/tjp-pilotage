import { z } from "zod";

export const submitIntentionAccessLogSchema = {
  body: z.object({
    intention: z.object({
      numero: z.string(),
    }),
  }),
  response: {
    200: z.object({
      id: z.string(),
    }),
  },
};
