import { z } from "zod";

export const NLienFormationGroupeSchema = z.object({
  TYPE_GROUPE_FORMATION: z.string(),
  LIBELLE_COURT: z.string(),
  LIBELLE_LONG: z.string(),
  LIBELLE_EDITION: z.string(),
  DATE_OUVERTURE: z.string(),
  DATE_FERMETURE: z.string(),
  DATE_INTERVENTION: z.string(),
  N_COMMENTAIRE: z.string(),
});

export type NLienFormationGroupe = z.infer<typeof NLienFormationGroupeSchema>;
