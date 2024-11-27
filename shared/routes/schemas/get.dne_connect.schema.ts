import { z } from "zod";

export const redirectDneSchema = {
  response: {
    200: z.object({ token: z.string() }),
  },
};
