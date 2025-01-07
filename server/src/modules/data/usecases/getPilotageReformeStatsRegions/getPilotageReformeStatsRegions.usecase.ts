import { dependencies } from "./dependencies";

const getPilotageReformeStatsRegionsFactory =
  (
    deps = {
      getStatsRegions: dependencies.getStatsRegions,
      findFiltersInDb: dependencies.findFiltersInDb,
    }
  ) =>
    async (activeFilters: { codeNiveauDiplome?: string[]; orderBy?: { order: "asc" | "desc"; column: string } }) => {
      const [statsRegions, filters] = await Promise.all([deps.getStatsRegions(activeFilters), deps.findFiltersInDb()]);

      return {
        statsRegions,
        filters,
      };
    };

export const getPilotageReformeStatsRegions = getPilotageReformeStatsRegionsFactory();
