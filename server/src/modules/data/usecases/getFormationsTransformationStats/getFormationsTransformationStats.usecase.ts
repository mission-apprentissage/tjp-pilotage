import { getStatsSortie } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies, Filters } from "./dependencies";

const getFormationsTransformationStatsFactory =
  (
    deps = {
      getFormationsTransformationStatsQuery:
        dependencies.getFormationsTransformationStatsQuery,
      getRegionStats: dependencies.getRegionStats,
    }
  ) =>
  async (activeFilters: Filters) => {
    const [formations, statsSortie] = await Promise.all([
      deps.getFormationsTransformationStatsQuery(activeFilters),
      getStatsSortie(activeFilters),
    ]);

    return {
      stats: statsSortie,
      formations: formations.map((formation) => ({
        ...formation,
        positionQuadrant: getPositionQuadrant(formation, statsSortie),
      })),
    };
  };
export const getFormationsTransformationStats =
  getFormationsTransformationStatsFactory();
