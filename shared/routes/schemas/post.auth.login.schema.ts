import { z } from "zod";

import { LoginErrorsZodType } from "../../enum/loginErrorsEnum";
export const loginSchema = {
  body: z.object({
    email: z.string().email().toLowerCase(),
    password: z.string(),
  }),
  response: {
    200: z.object({
      token: z.string(),
    }),
    401: z.object({
      statusCode: z.number(),
      name: z.string(),
      message: LoginErrorsZodType,
    }),
  },
};
