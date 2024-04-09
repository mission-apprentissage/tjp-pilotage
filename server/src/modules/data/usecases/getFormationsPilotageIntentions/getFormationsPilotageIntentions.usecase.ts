import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { getStatsSortieQuery } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies, Filters } from "./dependencies";

const getQuadrantPilotageIntentionsFactory =
  (
    deps = {
      getFormationsPilotageIntentionsQuery:
        dependencies.getFormationsPilotageIntentionsQuery,
      getStatsSortieQuery,
      getCurrentCampagneQuery,
    }
  ) =>
  async (activeFilters: Filters) => {
    const campagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne = activeFilters.anneeCampagne ?? campagne.annee;
    const [formations, statsSortie] = await Promise.all([
      deps.getFormationsPilotageIntentionsQuery({
        anneeCampagne,
        ...activeFilters,
      }),
      getStatsSortieQuery(activeFilters),
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
