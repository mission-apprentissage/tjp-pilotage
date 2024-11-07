import { z } from "zod";

export const checkActivationTokenSchema = {
  querystring: z.object({
    activationToken: z.string(),
  }),
  response: {
    200: z.object({
      valid: z.literal(true),
    }),
  },
};
