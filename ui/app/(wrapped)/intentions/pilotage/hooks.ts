import { useMemo } from "react";

import { FiltersStatsPilotageIntentions } from "./types";

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
      case "region":
        return filters.codeRegion;
      case "academie":
        return filters.codeAcademie;
      case "departement":
        return filters.codeDepartement;
      case "national":
        return "national";
      default:
        return undefined;
    }
  }, [filters]);

  return { code };
};
