import { getCurrentCampagneQuery } from "@/modules/data/queries/getCurrentCampagne/getCurrentCampagne.query";

import type { Filters } from "./dependencies";
import { dependencies } from "./dependencies";

interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}

const getStatsRestitutionIntentionsFactory =
  (
    deps = {
      getStatsRestitutionIntentionsQuery: dependencies.getStatsRestitutionIntentionsQuery,
      getCurrentCampagneQuery: getCurrentCampagneQuery,
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const anneeCampagne = activeFilters.campagne ?? (await deps.getCurrentCampagneQuery()).annee;
      const countRestitutionIntentions = deps.getStatsRestitutionIntentionsQuery({
        ...activeFilters,
        campagne: anneeCampagne,
      });

      return await countRestitutionIntentions;
    };

export const getStatsRestitutionIntentionsUsecase = getStatsRestitutionIntentionsFactory();
