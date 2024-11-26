import { z } from "zod";
export const deleteChangementStatutSchema = {
  params: z.object({ id: z.string() }),
  response: {
    200: z.void(),
  },
};
