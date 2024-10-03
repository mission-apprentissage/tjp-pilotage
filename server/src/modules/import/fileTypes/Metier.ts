import { z } from "zod";

export const MetierSchema = z.object({
  code_ogr: z.string(),
  libelle_appellation_long: z.string(),
  libelle_appellation_court: z.string().optional(),
  code_rome: z.string(),
  transition_eco: z.string().optional(),
  transition_num: z.string().optional(),
  transition_demo: z.string().optional(),
  emploi_reglemente: z.string().optional(),
  emploi_cadre: z.string().optional(),
  classification: z.string().optional(),
  origine: z.string().optional(),
});

export type Metier = z.infer<typeof MetierSchema>;
