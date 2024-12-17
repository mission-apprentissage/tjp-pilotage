import { z } from "zod";

export const userFonction = z.enum([
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
]);

export const UserFonctionEnum = userFonction.Enum;

export type UserFonction = z.infer<typeof userFonction>;
