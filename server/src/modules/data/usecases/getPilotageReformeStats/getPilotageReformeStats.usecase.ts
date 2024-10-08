import {
  getFilters,
  getStats,
  getStatsTauxDeTransformation,
  getTauxTransformationCumule,
} from "./dependencies";

const getPilotageReformeStatsFactory =
  (
    deps = {
      getStats,
      getFilters,
      getTauxTransformationCumule,
      getStatsTauxDeTransformation,
    }
  ) =>
  async (activeFilters: {
    codeRegion?: string | undefined;
    codeNiveauDiplome?: string[] | undefined;
  }) => {
    const [
      stats,
      filters,
      tauxTransformationCumule,
      statsTauxDeTransformation,
    ] = await Promise.all([
      deps.getStats(activeFilters),
      deps.getFilters(),
      deps.getTauxTransformationCumule(activeFilters),
      deps.getStatsTauxDeTransformation(activeFilters),
    ]);

    return {
      ...stats,
      statsTauxDeTransformation,
      tauxTransformationCumule,
      filters,
    };
  };

export const getPilotageReformeStats = getPilotageReformeStatsFactory();
