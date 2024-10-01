import { z } from "zod";

export const OptionsBTSSchema = z.object({
  CFD_COMMUN: z.string(),
  FAMILLE: z.string(),
  CFD_SPECIALITE: z.string(),
  SPECIALITE: z.string(),
  "RS CFDannee1": z.string(),
  "Date ouverture CFDannee1": z.string(),
  "Date fermeture CFDannee1": z.string(),
  "RS CFDannee2": z.string(),
  "Date ouverture CFDannee2": z.string(),
  "Date fermeture CFDannee2": z.string(),
  CODE_MINISTERE_TUTELLE: z.string(),
});

export type OptionsBTSLine = z.infer<typeof OptionsBTSSchema>;
