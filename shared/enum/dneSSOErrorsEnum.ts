import { z } from "zod";

export const DneSSOErrorsZodType = z.enum([
  "FALIURE_ON_DNE_REDIRECT",
  "MISSING_USER_EMAIL",
  "USER_NOT_ENABLED",
  "MISSING_RIGHTS",
  "MISSING_CODE_REGION",
  "MISSING_CODE_VERIFIER",
  "MISSING_CODEVERIFIERJWT",
  "MISSING_ACCESS_TOKEN",
  "MISSING_USERINFO"
]);

export const DneSSOErrorsEnum = DneSSOErrorsZodType.Enum;

export type DneSSOErrorsType = z.infer<typeof DneSSOErrorsZodType>;
