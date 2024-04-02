import { getStatsSortie } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies, Filters } from "./dependencies";

const getQuadrantPilotageIntentionsFactory =
  (
    deps = {
      getFormationsPilotageIntentionsQuery:
        dependencies.getFormationsPilotageIntentionsQuery,
      getRegionStats: dependencies.getRegionStats,
    }
  ) =>
  async (activeFilters: Filters) => {
    const [formations, statsSortie] = await Promise.all([
      deps.getFormationsPilotageIntentionsQuery(activeFilters),
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
export const getFormationsPilotageIntentionsUsecase =
  getQuadrantPilotageIntentionsFactory();
