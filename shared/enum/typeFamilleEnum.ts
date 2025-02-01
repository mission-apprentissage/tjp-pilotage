import { z } from "zod";

export const TypeFamilleZodType = z.enum(["2nde_commune", "1ere_commune", "specialite", "option"]);

export const TypeFamilleEnum = TypeFamilleZodType.Enum;

export type TypeFamille = z.infer<typeof TypeFamilleZodType>;
