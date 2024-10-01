import { z } from "zod";

export const MetierSchema = z.object({
  code_ogr: z.string(),
  libelle_appellation_long: z.string(),
  libelle_appellation_court: z.string(),
  code_rome: z.string(),
  transition_eco: z.string(),
  transition_num: z.string(),
  transition_demo: z.string(),
  emploi_reglemente: z.string(),
  emploi_cadre: z.string(),
  classification: z.string(),
  origine: z.string(),
});

export type Metier = z.infer<typeof MetierSchema>;
