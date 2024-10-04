import { z } from "zod";

export const RegroupementSchema = z.object({
  MEF_STAT_11: z.string(),
  "REGROUPEMENT A2-2": z.string(),
});

export type Regroupement = z.infer<typeof RegroupementSchema>;
