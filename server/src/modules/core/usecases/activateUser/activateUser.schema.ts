import { passwordRegex } from "shared";
import { z } from "zod";
export const activateUserSchema = {
  body: z.object({
    password: z.string().regex(new RegExp(passwordRegex)),
    repeatPassword: z.string(),
    activationToken: z.string(),
  }),
  response: { 200: z.void() },
};
