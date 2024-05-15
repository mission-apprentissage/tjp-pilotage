import { z } from "zod";

export const DemandeStatutZodType = z.enum([
  "proposition",
  "demande validée",
  "refusée",
  "supprimée",
  "brouillon",
  "dossier complet",
  "dossier incomplet",
  "projet de demande",
  "prêt pour le vote",
]);

export const DemandeStatutEnum = DemandeStatutZodType.Enum;

export type DemandeStatutType = z.infer<typeof DemandeStatutZodType>;
