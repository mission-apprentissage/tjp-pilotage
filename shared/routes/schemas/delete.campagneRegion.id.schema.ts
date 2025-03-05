import { z } from "zod";

export const deleteCampagneRegionSchema = {
  params: z.object({ id: z.string() }),
  response: {
    200: z.void(),
  },
};
