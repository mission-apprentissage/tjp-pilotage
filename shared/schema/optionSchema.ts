import { z } from "zod";

export const OptionSchema = z.object({
  label: z.coerce.string(),
  value: z.coerce.string(),
});

export type OptionType = z.infer<typeof OptionSchema>;
