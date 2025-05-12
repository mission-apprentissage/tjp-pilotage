import { z } from "zod";

export const DneSSOInfoZodType = z.enum([
  "USER_CREATED",
  "USER_LOGGED_IN",
  "USER_SWITCHED",
]);

export const DneSSOInfoEnum = DneSSOInfoZodType.Enum;

export type DneSSOInfoType = z.infer<typeof DneSSOInfoZodType>;
