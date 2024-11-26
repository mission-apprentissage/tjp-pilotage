import { z } from "zod";

export const scope = z.enum(["région", "académie", "département", "national"]);

export const ScopeEnum = scope.Enum;

export type ScopeZone = z.infer<typeof scope>;
