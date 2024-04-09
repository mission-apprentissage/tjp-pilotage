import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { dependencies, Filters } from "./dependencies";

const getStatsRestitutionIntentionsFactory =
  (
    deps = {
      getStatsRestitutionIntentionsQuery:
        dependencies.getStatsRestitutionIntentionsQuery,
      getCurrentCampagneQuery: getCurrentCampagneQuery,
    }
  ) =>
  async (activeFilters: Filters) => {
    const anneeCampagne =
      activeFilters.anneeCampagne ??
      (await deps.getCurrentCampagneQuery()).annee;
    const countRestitutionIntentions = deps.getStatsRestitutionIntentionsQuery({
      anneeCampagne,
      ...activeFilters,
    });

    return await countRestitutionIntentions;
  };

export const getStatsRestitutionIntentionsUsecase =
  getStatsRestitutionIntentionsFactory();
