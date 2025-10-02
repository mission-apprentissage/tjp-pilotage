import { z } from "zod";

export const NLienFormationGroupeSchema = z.object({
  GROUPE_FORMATION: z.string(),
  FORMATION_DIPLOME: z.string(),
  DATE_OUVERTURE: z.string(),
  DATE_FERMETURE: z.string(),
  DATE_INTERVENTION: z.string(),
  N_COMMENTAIRE: z.string(),
});

export type NLienFormationGroupe = z.infer<typeof NLienFormationGroupeSchema>;
