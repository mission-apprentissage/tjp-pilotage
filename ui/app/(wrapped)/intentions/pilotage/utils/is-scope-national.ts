import { Scope } from "../types";

export function isScopeNational(scope: Scope): boolean {
  return scope === "national";
}
