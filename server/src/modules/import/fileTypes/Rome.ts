import { z } from "zod";

export const RomeSchema = z.object({
  code_rome: z.string(),
  code_fiche_metier: z.string(),
  code_ogr: z.string(),
  libelle_rome: z.string(),
  transition_eco: z.string(),
  transition_num: z.string(),
  transition_demo: z.string(),
  dipl_reglemente: z.string(),
  dipl_cadre: z.string(),
  code_rome_parent: z.string(),
});

export type Rome = z.infer<typeof RomeSchema>;
