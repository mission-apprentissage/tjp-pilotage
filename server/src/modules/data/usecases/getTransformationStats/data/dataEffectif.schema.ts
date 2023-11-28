import { z } from "zod";

export const effectifParDiplomeSchema = z.record(
  z.string(),
  z.object({
    nb: z.number(),
    horsTom: z.boolean(),
    rentree: z.number(),
  })
);

export type EffectifParDiplome = z.infer<typeof effectifParDiplomeSchema>;

export const dataEffectifSchema = z.record(
  z.string(),
  effectifParDiplomeSchema
);

export type DataEffectif = z.infer<typeof dataEffectifSchema>;
