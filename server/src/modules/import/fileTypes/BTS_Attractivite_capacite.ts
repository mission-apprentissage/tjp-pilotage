import { z } from "zod";

export const BTSAttractiviteCapaciteSchema = z.object({
  UAI: z.string(),
  LIBELLÉFORMATION: z.string(),
  MEFSTAT11: z.string(),
  NB_VOEUX_CONFIRMES: z.string(),
  STATUT: z.string(),
  CAPACITEPSUP: z.string().optional(),
  CFD: z.string(),
  "CFD rectifié": z.string(),
  Rectif: z.string(),
  MEFSTAT11_old: z.string(),
});

export type BTS_Attractivite_capacite = z.infer<typeof BTSAttractiviteCapaciteSchema>;
