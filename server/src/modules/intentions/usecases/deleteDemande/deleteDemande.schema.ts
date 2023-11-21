import { z } from "zod";
export const deleteDemandeSchema = {
  params: z.object({ id: z.string() }),
  response: {
    200: z.void(),
  },
};
