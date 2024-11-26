import { z } from "zod";

export const RaisonCorrectionZodType = z.enum(["report", "annulation", "modification_capacite"]);

export const RaisonCorrectionEnum = RaisonCorrectionZodType.Enum;

export type RaisonCorrectionType = z.infer<typeof RaisonCorrectionZodType>;
