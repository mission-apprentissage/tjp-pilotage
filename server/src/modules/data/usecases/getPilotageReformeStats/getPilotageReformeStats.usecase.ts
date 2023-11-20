import { dependencies } from "./dependencies";

const getPilotageReformeStatsFactory =
  (
    deps = {
      getStats: dependencies.getStats,
      findFiltersInDb: dependencies.findFiltersInDb,
    }
  ) =>
  async (activeFilters: {
    codeNiveauDiplome?: string[];
    orderBy?: { order: "asc" | "desc"; column: string };
  }) => {
    const [stats, filters] = await Promise.all([
      deps.getStats(activeFilters),
      deps.findFiltersInDb(),
    ]);

    return {
      ...stats,
      filters,
    };
  };

export const getPilotageReformeStats = getPilotageReformeStatsFactory();
