import { z } from "zod";

export const AvisTypeZodType = z.enum(["préalable", "consultatif", "final"]);

export const AvisTypeEnum = AvisTypeZodType.Enum;

export type AvisTypeType = z.infer<typeof AvisTypeZodType>;
