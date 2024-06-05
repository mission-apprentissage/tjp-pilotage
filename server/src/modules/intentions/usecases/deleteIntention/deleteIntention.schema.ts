import { z } from "zod";
export const deleteIntentionSchema = {
  params: z.object({ numero: z.string() }),
  response: {
    200: z.void(),
  },
};
