import { z } from "zod";

export const DemandeStatutZodType = z.enum([
  "brouillon", // Brouillon visible uniquement de l'utilisateur dont elle émane
  "proposition", // Proposition dont la complétude doit être inspectée
  "dossier complet", // Proposition complète
  "dossier incomplet", // Proposition incomplète
  "projet de demande", // Proposition dont la complétude a été étudiée ayant fait l'objet d'avis préalable et qui devra être soumise à avis
  "prêt pour le vote", // Proposition soumise à avis consultatifs et prête pour le vote
  "demande validée", // Proposition ayant reçu un avis favorable
  "refusée", // Proposition ayant reçu un avis défavorable
  "supprimée", // Proposition supprimée
]);

export const DemandeStatutEnum = DemandeStatutZodType.Enum;

export type DemandeStatutType = z.infer<typeof DemandeStatutZodType>;

export type DemandeStatutWithoutSupprimee = Exclude<DemandeStatutType, "supprimée">;
