import { z } from "zod";

export const demandeStatut = z.enum([
  "draft",
  "submitted",
  "refused",
  "deleted",
]);

export const DemandeStatutEnum = demandeStatut.Enum;

export type DemandeStatut = z.infer<typeof demandeStatut>;
