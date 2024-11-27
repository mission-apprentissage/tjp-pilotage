import { z } from "zod";

export const sendResetPasswordSchema = {
  body: z.object({
    email: z.string().email().toLowerCase(),
  }),
  response: { 200: z.void() },
};
