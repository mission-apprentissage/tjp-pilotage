import { z } from "zod";

export const NFormationDiplomeSchema = z.object({
  LIBELLE_LONG_200: z.string(),
  FORMATION_DIPLOME: z.string(),
  DATE_OUVERTURE: z.string(),
  DATE_FERMETURE: z.string().optional(),
  ANCIEN_DIPLOME_1: z.string().optional(),
  ANCIEN_DIPLOME_2: z.string().optional(),
  ANCIEN_DIPLOME_3: z.string().optional(),
  ANCIEN_DIPLOME_4: z.string().optional(),
  ANCIEN_DIPLOME_5: z.string().optional(),
  ANCIEN_DIPLOME_6: z.string().optional(),
  ANCIEN_DIPLOME_7: z.string().optional(),
});

export type NFormationDiplomeLine = z.infer<typeof NFormationDiplomeSchema>;
