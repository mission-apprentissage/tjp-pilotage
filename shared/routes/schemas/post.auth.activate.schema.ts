import { z } from "zod";

import { passwordRegex } from "../../utils/passwordRegex";
export const activateUserSchema = {
  body: z.object({
    password: z.string().regex(new RegExp(passwordRegex)),
    repeatPassword: z.string(),
    activationToken: z.string(),
  }),
  response: { 200: z.void() },
};
