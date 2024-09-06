import { z } from "zod";

export const SecteurZodType = z.enum(["PU", "PR"]);

export const SecteurEnum = SecteurZodType.Enum;

export type SecteurType = z.infer<typeof SecteurZodType>;
