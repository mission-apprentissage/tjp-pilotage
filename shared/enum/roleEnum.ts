import { z } from "zod";

export const RoleZodType = z.enum([
  "region",
  "admin",
  "pilote",
  "admin_region",
  "pilote_region",
  "gestionnaire_region",
  "expert_region",
  "perdir",
  "invite"
]);

export const RoleEnum = RoleZodType.Enum;

export type Role = z.infer<typeof RoleZodType>;
