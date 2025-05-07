import { z } from "zod";

export const DemandeTypeZodType = z.enum([
  "fermeture",
  "augmentation_compensation",
  "ouverture_nette",
  "transfert",
  "coloration",
  "diminution",
  "augmentation_nette",
  "ouverture_compensation",
  "ajustement",
]);

export const DemandeTypeEnum = DemandeTypeZodType.Enum;

export type TypeDemandeType = z.infer<typeof DemandeTypeZodType>;
