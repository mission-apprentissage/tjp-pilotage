import { z } from "zod";

export const OptionsBTSSchema = z.object({
  CFD_COMMUN: z.string(),
  FAMILLE: z.string(),
  CFD_SPECIALITE: z.string(),
  SPECIALITE: z.string().optional(),
  "RS CFDannee1": z.string().optional(),
  "Date ouverture CFDannee1": z.string().optional(),
  "Date fermeture CFDannee1": z.string().optional(),
  "RS CFDannee2": z.string().optional(),
  "Date ouverture CFDannee2": z.string().optional(),
  "Date fermeture CFDannee2": z.string().optional(),
  CODE_MINISTERE_TUTELLE: z.string(),
});

export type OptionsBTSLine = z.infer<typeof OptionsBTSSchema>;
