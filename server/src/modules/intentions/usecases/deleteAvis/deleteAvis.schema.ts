import { z } from "zod";

export const deleteAvisSchema = {
  params: z.object({ id: z.string() }),
  response: {
    200: z.void(),
  },
};
