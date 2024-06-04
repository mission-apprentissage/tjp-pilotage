import { z } from "zod";

export const deleteSuiviSchema = {
  params: z.object({ id: z.string() }),
  response: {
    200: z.void(),
  },
};
