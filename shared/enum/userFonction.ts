import { z } from "zod";

export const userFonction = z.enum([
  "région",
  "région académique",
  "inspecteur",
  "DO CMQ",
  "conseiller en formation professionnelle",
  "coordonnateur de CFA-A",
  "DRAIO",
  "services DOS",
  "DASEN",
  "DRAFPIC",
  "SGRA",
  "CSA",
  "recteur",
]);

export const UserFonctionEnum = userFonction.Enum;

export type UserFonction = z.infer<typeof userFonction>;
