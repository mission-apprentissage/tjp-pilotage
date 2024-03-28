import { z } from "zod";
export const deleteDemandeSchema = {
  params: z.object({ numero: z.string() }),
  response: {
    200: z.void(),
  },
};
