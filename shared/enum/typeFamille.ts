import { z } from "zod";

export const typeFamille = z.enum(["2nde_commune", "1ere_commune"]);

export const TypeFamilleEnum = typeFamille.Enum;

export type TypeFamille = z.infer<typeof typeFamille>;
