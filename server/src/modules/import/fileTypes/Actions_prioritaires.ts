import { z } from "zod";

export const ActionsPrioritairesSchema = z.object({
  Formation: z.string(),
  Diplôme: z.string(),
  cfd: z.string(),
  "Région sélectionnée": z.string(),
  codeRegion: z.string(),
  codeDispositif: z.string(),
});

export type Actions_prioritaires = z.infer<typeof ActionsPrioritairesSchema>;
