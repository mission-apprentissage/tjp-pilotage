import { z } from "zod";
export const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  response: {
    200: z.object({
      token: z.string(),
    }),
  },
};
