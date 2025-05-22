import { z } from "zod";

export const UserFonctionZodType = z.enum([
  "Région",
  "Région académique",
  "Inspecteur",
  "Directeur(ice) de CMQ",
  "Conseiller(ère) en formation professionnelle",
  "Coordonnateur de CFA-A",
  "DRAIO",
  "Services DOS",
  "SSA",
  "DASEN",
  "DRAFPIC",
  "Chargé(e) d'étude DRAFPIC",
  "Référent(e) DSI",
  "SGRASGA",
  "CSA",
  "Recteur(ice)",
  "DGESCO",
  "Cabinet",
  "Inspécteur(ice)",
  "Inspécteur(ice) général(e)",
  "Chef(fe) d'établissement",
  // obsolete mais encore en base
  "Référent DSI",
  "Conseiller en formation professionnelle",
  "DO CMQ",
  "SGRA",
  "Recteur",
]);

export const UserFonctionEnum = UserFonctionZodType.Enum;

export type UserFonction = z.infer<typeof UserFonctionZodType>;
