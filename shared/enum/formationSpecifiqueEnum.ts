import { z } from "zod";

export const TypeFormationSpecifiqueZodType = z.enum([
  "Action prioritaire",
  "Transition écologique",
  "Transition démographique",
  "Transition numérique",
]);

export const TypeFormationSpecifiqueEnum = TypeFormationSpecifiqueZodType.Enum;

export type TypeFormationSpecifiqueType = z.infer<typeof TypeFormationSpecifiqueZodType>;
