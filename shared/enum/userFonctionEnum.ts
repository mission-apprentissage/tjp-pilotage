import { z } from "zod";

export const UserFonctionZodType = z.enum([
  "Région",
  "Région académique",
  "Inspecteur",
  "DO CMQ",
  "Conseiller en formation professionnelle",
  "Coordonnateur de CFA-A",
  "DRAIO",
  "Services DOS",
  "DASEN",
  "DRAFPIC",
  "SGRA",
  "CSA",
  "Recteur",
  "DGESCO",
  "Cabinet"
]);

export const UserFonctionEnum = UserFonctionZodType.Enum;

export type UserFonction = z.infer<typeof UserFonctionZodType>;
