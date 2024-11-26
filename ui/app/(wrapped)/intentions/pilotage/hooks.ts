import { useMemo } from "react";
import { ScopeEnum } from "shared";

import type { FiltersStatsPilotageIntentions } from "./types";

/**
 * Récupère le code du filtre en fonction du scope :
 * - Si le scope est académie, récupérer le code académie
 * - Si le scope est région, récupérer le code region
 * - Si le scope est département, récupérer le code département
 * - Si le scope est national, ne pas récupérer de code
 */
export const useScopeCode = (filters: FiltersStatsPilotageIntentions) => {
  const code = useMemo(() => {
    switch (filters.scope) {
      case ScopeEnum["région"]:
        return filters.codeRegion;
      case ScopeEnum["académie"]:
        return filters.codeAcademie;
      case ScopeEnum["département"]:
        return filters.codeDepartement;
      case "national":
        return "national";
      default:
        return undefined;
    }
  }, [filters]);

  return { code };
};
