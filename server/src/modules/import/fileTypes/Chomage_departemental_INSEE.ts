import { z } from "zod";

export const ChomageDepartementalINSEESchema = z.object({
  codeDepartement: z.string(),
  rentreeScolaire: z.string(),
  tauxChomage: z.string(),
});

export type Chomage_departemental_INSEE = z.infer<typeof ChomageDepartementalINSEESchema>;
