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
      getTauxChomage: dependencies.getTauxChomage,
    }
  ) =>
    async (activeFilters: { codeNiveauDiplome?: string; codeRegion?: string }) => {

      const rentreesScolaire = await deps.getRentreesScolaire();
      const { codeNiveauDiplome } = activeFilters;

      const [
        filters,
        stats,
        tauxTransformationCumuleScoped,
        tauxTransformationCumulePrevisionnelScoped,
        tauxTransformationCumuleNational,
        tauxTransformationCumulePrevisionnelNational,
        tauxChomageNational,
      ] = await Promise.all([
        deps.getFilters(),
        deps.getStats(activeFilters),
        deps.getTauxTransformationCumule({ rentreesScolaire, ...activeFilters }),
        deps.getTauxTransformationCumulePrevisionnel({ rentreesScolaire, ...activeFilters }),
        deps.getTauxTransformationCumule({ rentreesScolaire, codeNiveauDiplome }),
        deps.getTauxTransformationCumulePrevisionnel({ rentreesScolaire, codeNiveauDiplome }),
        deps.getTauxChomage(),
      ]);

      return {
        ...stats,
        filters,
        rentreesScolaire,
        scoped: {
          tauxTransformationCumule: tauxTransformationCumuleScoped,
          tauxTransformationCumulePrevisionnel: tauxTransformationCumulePrevisionnelScoped,
        },
        national: {
          tauxTransformationCumule: tauxTransformationCumuleNational,
          tauxTransformationCumulePrevisionnel: tauxTransformationCumulePrevisionnelNational,
          tauxPoursuite: stats.annees[0]?.nationale?.tauxPoursuite,
          tauxInsertion: stats.annees[0]?.nationale?.tauxInsertion,
          tauxChomage: tauxChomageNational,
        }
      };
    };

export const getSuiviImpactStats = getSuiviImpactStatsFactory();
