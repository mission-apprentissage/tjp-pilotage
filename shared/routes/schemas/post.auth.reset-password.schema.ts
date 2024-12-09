import { z } from "zod";

import { passwordRegex } from "../../utils/passwordRegex";

export const resetPasswordSchema = {
  body: z.object({
    password: z.string().regex(new RegExp(passwordRegex)),
    repeatPassword: z.string(),
    resetPasswordToken: z.string(),
  }),
  response: { 200: z.void() },
};
