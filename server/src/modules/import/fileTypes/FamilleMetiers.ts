import { z } from "zod";

export const FamillesMetiersSchema = z.object({
  FAMILLE: z.string(),
  SPECIALITE: z.string(),
  MEFSTAT11_COMMUN: z.string(),
  CFD_COMMUN: z.string(),
  MEFSTAT11_SPECIALITE: z.string(),
  CFD_SPECIALITE: z.string(),
  CODE_MINISTERE_TUTELLE: z.string(),
});

export type FamillesMetiersLine = z.infer<typeof FamillesMetiersSchema>;
