import {
  getFilters,
  getStats,
  getTauxTransfoCumuleParRegion,
} from "./dependencies";

const getPilotageReformeStatsRegionsFactory =
  (
    deps = {
      getTauxTransfoCumuleParRegion,
      getStats,
      getFilters,
    }
  ) =>
  async (activeFilters: {
    codeNiveauDiplome?: string[];
    orderBy?: { order: "asc" | "desc"; column: string };
  }) => {
    const [statsRegions, filters, tauxTransfoCumuleParRegion] =
      await Promise.all([
        deps.getStats(activeFilters),
        deps.getFilters(),
        deps.getTauxTransfoCumuleParRegion(activeFilters),
      ]);

    const statsWithTauxTransfo = statsRegions.map((stats) => ({
      ...stats,
      tauxTransformation: tauxTransfoCumuleParRegion.find(
        (t) => t.codeRegion === stats.codeRegion
      )?.tauxTransformation,
    }));

    if (activeFilters.orderBy?.column === "tauxTransformation") {
      statsWithTauxTransfo.sort((a, b) => {
        if (activeFilters.orderBy?.order === "asc") {
          return (a.tauxTransformation ?? 0) - (b.tauxTransformation ?? 0);
        } else {
          return (b.tauxTransformation ?? 0) - (a.tauxTransformation ?? 0);
        }
      });
    }

    return {
      statsRegions: statsWithTauxTransfo,
      filters,
    };
  };

export const getPilotageReformeStatsRegions =
  getPilotageReformeStatsRegionsFactory();
