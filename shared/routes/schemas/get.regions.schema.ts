import { z } from "zod";

export const getRegionsSchema = {
  response: {
    200: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
  },
};
