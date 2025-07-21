import { z } from "zod";

export const getHomeSchema = {
  response: {
    200: z.object({
      name: z.string(),
      version: z.string(),
      env: z.enum(["local", "test", "qualification", "diffusion", "preproduction", "production", "recette1", "recette2", "productionij" ]),
    }),
  },
};
