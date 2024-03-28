import { z } from "zod";

export const voie = z.enum(["scolaire", "apprentissage"]);

export const VoieEnum = voie.Enum;

export type Voie = z.infer<typeof voie>;
