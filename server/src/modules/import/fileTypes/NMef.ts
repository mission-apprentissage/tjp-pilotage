import { z } from "zod";

export const NMefSchema = z.object({
  MEF: z.string(),
  MEF_STAT_11: z.string(),
  LIBELLE_LONG: z.string(),
  DUREE_DISPOSITIF: z.string(),
  ANNEE_DISPOSITIF: z.string(),
  DISPOSITIF_FORMATION: z.string(),
});

export type NMefLine = z.infer<typeof NMefSchema>;
