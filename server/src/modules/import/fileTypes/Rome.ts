import { z } from "zod";

export const RomeSchema = z.object({
  code_rome: z.string(),
  code_fiche_metier: z.string().optional(),
  code_ogr: z.string().optional(),
  libelle_rome: z.string(),
  transition_eco: z.string().optional(),
  transition_num: z.string().optional(),
  transition_demo: z.string().optional(),
  dipl_reglemente: z.string().optional(),
  dipl_cadre: z.string().optional(),
  code_rome_parent: z.string().optional(),
});

export type Rome = z.infer<typeof RomeSchema>;
