import type { getSuiviImpactStatsSchema } from "shared/routes/schemas/get.suivi-impact.stats.schema";
import type { z } from "zod";

import * as dependencies from "./deps";

export interface Filters extends z.infer<typeof getSuiviImpactStatsSchema.querystring> {
  campagne: string;
}
const getSuiviImpactStatsFactory =
  (
    deps = {
      getRentreesScolaire: dependencies.getRentreesScolaire,
      getFilters: dependencies.getFilters,
      getTauxTransformationCumule: dependencies.getTauxTransformationCumule,
      getStats: dependencies.getStats,
      getTauxTransformationCumulePrevisionnel: dependencies.getTauxTransformationCumulePrevisionnel,
    }
  ) =>
    async (activeFilters: { codeNiveauDiplome?: string; codeRegion?: string }) => {

      const rentreesScolaire = await deps.getRentreesScolaire();

      const [filters,stats, tauxTransformationCumule,  tauxTransformationCumulePrevisionnel] = await Promise.all([
        deps.getFilters(),
        deps.getStats(activeFilters),
        deps.getTauxTransformationCumule({ rentreesScolaire, ...activeFilters }),
        deps.getTauxTransformationCumulePrevisionnel({ rentreesScolaire, ...activeFilters })
      ]);


      return {
        ...stats,
        filters,
        rentreesScolaire,
        tauxTransformationCumule,
        tauxTransformationCumulePrevisionnel
      };
    };

export const getSuiviImpactStats = getSuiviImpactStatsFactory();
