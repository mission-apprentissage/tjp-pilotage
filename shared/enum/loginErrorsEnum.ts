import { z } from "zod";

export const LoginErrorsZodType = z.enum([
  "WRONG_CREDENTIALS",
  "EXTERNAL_USER",
  "UNKNOWN"
]);

export const LoginErrorsEnum = LoginErrorsZodType.Enum;

export type LoginErrorsType = z.infer<typeof LoginErrorsZodType>;
