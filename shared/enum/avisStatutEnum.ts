import { z } from "zod";

export const AvisStatutZodType = z.enum(["favorable", "défavorable", "réservé"]);

export const AvisStatutEnum = AvisStatutZodType.Enum;

export type AvisStatutType = z.infer<typeof AvisStatutZodType>;
