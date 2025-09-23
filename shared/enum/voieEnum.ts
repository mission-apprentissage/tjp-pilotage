import { z } from "zod";

export const VoieZodType = z.enum(["scolaire", "apprentissage"]);

export const VoieEnum = VoieZodType.Enum;

export type VoieType = z.infer<typeof VoieZodType>;
