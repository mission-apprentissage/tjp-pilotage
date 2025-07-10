import { z } from "zod";

export const getHomeSchema = {
  response: {
    200: z.object({
      name: z.string(),
      version: z.string(),
      env: z.enum(["local", "recette1", "recette2", "production", "qualification", "diffusion", "test", "preproduction"]),
    }),
  },
};
