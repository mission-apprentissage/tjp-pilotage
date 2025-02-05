import * as dependencies from "./deps";

const getSuiviImpactStatsRegionsFactory =
  (
    deps = {
      getStatsRegions: dependencies.getStatsRegions,
      getRentreesScolaire: dependencies.getRentreesScolaire,
    }
  ) =>
    async (activeFilters: { codeNiveauDiplome?: string; orderBy?: { order: "asc" | "desc"; column: string } }) => {
      const rentreesScolaire = await deps.getRentreesScolaire();

      const statsRegions = await deps.getStatsRegions({ ...activeFilters, rentreesScolaire });

      return {
        statsRegions,
        rentreesScolaire
      };
    };

export const getSuiviImpactStatsRegions = getSuiviImpactStatsRegionsFactory();
