import { z } from "zod";

export const uploadDemandeFilesSchema = {
  body: z.any(),
  params: z.object({
    numero: z.string(),
  }),
  response: {
    200: z.void(),
  },
};
