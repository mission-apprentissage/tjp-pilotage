import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { countIntentionsQuery, Filters } from "./countIntentions.query";
const countIntentionsFactory =
  (
    deps = {
      countIntentionsQuery,
      getCurrentCampagneQuery,
    }
  ) =>
  async (activeFilters: Filters) => {
    const currentCampagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne = activeFilters.anneeCampagne ?? currentCampagne.annee;
    return await deps.countIntentionsQuery({
      anneeCampagne,
      ...activeFilters,
    });
  };

export const countIntentionsUsecase = countIntentionsFactory();
