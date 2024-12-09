import { z } from "zod";

export const NNiveauFormationDiplomeSchema = z.object({
  NIVEAU_FORMATION_DIPLOME: z.string(),
  LIBELLE_COURT: z.string(),
});

export type NNiveauFormationDiplome = z.infer<typeof NNiveauFormationDiplomeSchema>;
