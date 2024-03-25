import { z } from "zod";

export const environments = ["production", "recette", "dev", "test"] as const;

export const ENV = z.enum(environments);

export const EnvEnum = ENV.Enum;

export type ENV = z.infer<typeof ENV>;
