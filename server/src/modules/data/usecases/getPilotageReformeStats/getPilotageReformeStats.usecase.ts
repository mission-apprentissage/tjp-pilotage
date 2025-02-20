import type { getPilotageReformeStatsSchema } from "shared/routes/schemas/get.pilotage-reforme.stats.schema";
import type { z } from "zod";

import * as dependencies from "./deps";

export interface Filters extends z.infer<typeof getPilotageReformeStatsSchema.querystring> {
  campagne: string;
}
const getPilotageReformeStatsFactory =
  (
    deps = {
      getFilters: dependencies.getFilters,
      getTauxTransformationCumule: dependencies.getTauxTransformationCumule,
      getStats: dependencies.getStats,
      getTauxTransformationCumulePrevisionnel: dependencies.getTauxTransformationCumulePrevisionnel,
    }
  ) =>
    async (activeFilters: { codeNiveauDiplome?: string; codeRegion?: string }) => {
      const [filters,stats, tauxTransformationCumule,  tauxTransformationCumulePrevisionnel] = await Promise.all([
        deps.getFilters(),
        deps.getStats(activeFilters),
        deps.getTauxTransformationCumule(activeFilters),
        deps.getTauxTransformationCumulePrevisionnel(activeFilters)
      ]);


      return {
        ...stats,
        filters,
        tauxTransformationCumule,
        tauxTransformationCumulePrevisionnel
      };
    };

export const getPilotageReformeStats = getPilotageReformeStatsFactory();
