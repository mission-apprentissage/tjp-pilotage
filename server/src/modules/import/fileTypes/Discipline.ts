import { z } from "zod";

export const DisciplineSchema = z.object({
  codeDiscipline: z.string(),
  libelleDiscipline: z.string(),
});

export type Discipline = z.infer<typeof DisciplineSchema>;
