import { z } from "zod";

export const NDispositifFormationSchema = z.object({
  DISPOSITIF_FORMATION: z.string(),
  NIVEAU_FORMATION_DIPLOME: z.string(),
  LIBELLE_LONG: z.string(),
});

export type NDispositifFormation = z.infer<typeof NDispositifFormationSchema>;
