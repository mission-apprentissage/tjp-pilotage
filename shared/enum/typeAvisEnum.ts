import { z } from "zod";

export const TypeAvisZodType = z.enum(["préalable", "consultatif", "final"]);

export const TypeAvisEnum = TypeAvisZodType.Enum;

export type TypeAvisType = z.infer<typeof TypeAvisZodType>;
