import { z } from "zod";

export const VFormationDiplomeSchema = z.object({
  FORMATION_DIPLOME: z.string(),
  LIBELLE_LONG_200: z.string(),
  DATE_OUVERTURE: z.string(),
  DATE_FERMETURE: z.string(),
});

export type VFormationDiplomeLine = z.infer<typeof VFormationDiplomeSchema>;
