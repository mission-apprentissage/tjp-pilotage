import { z } from "zod";

export const getDepartementsSchema = {
  response: {
    200: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    ),
  },
};
