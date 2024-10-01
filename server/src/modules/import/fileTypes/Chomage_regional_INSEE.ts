import { z } from "zod";

export const ChomageRegionalINSEESchema = z.object({
  codeRegion: z.string(),
  rentreeScolaire: z.string(),
  tauxChomage: z.string(),
});

export type Chomage_regional_INSEE = z.infer<typeof ChomageRegionalINSEESchema>;
