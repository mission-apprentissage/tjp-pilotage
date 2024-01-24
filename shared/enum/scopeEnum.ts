import { z } from "zod";

export const scope = z.enum(["region", "academie", "departement", "national"]);

export const ScopeEnum = scope.Enum;

export type Scope = z.infer<typeof scope>;
