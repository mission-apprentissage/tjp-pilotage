import { z } from "zod";

export const ConstatSchema = z.object({
  UAI: z.string(),
  "Mef Bcp 11": z.string(),
  "Nombre d'élèves : Total": z.string(),
  "Rentrée scolaire": z.string(),
});

export type Constat = z.infer<typeof ConstatSchema>;
