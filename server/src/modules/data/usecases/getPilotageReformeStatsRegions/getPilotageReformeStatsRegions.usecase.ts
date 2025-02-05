import * as dependencies from "./deps";

const getPilotageReformeStatsRegionsFactory =
  (
    deps = {
      getStatsRegions: dependencies.getStatsRegions,
      getFilters: dependencies.getFilters,
    }
  ) =>
    async (activeFilters: { codeNiveauDiplome?: string; orderBy?: { order: "asc" | "desc"; column: string } }) => {
      const [statsRegions, filters] = await Promise.all([
        deps.getStatsRegions(activeFilters),
        deps.getFilters(),
      ]);

      return {
        statsRegions,
        filters,
      };
    };

export const getPilotageReformeStatsRegions = getPilotageReformeStatsRegionsFactory();
