import { getCurrentCampagneQuery } from "@/modules/intentions/queries/getCurrentCampagne/getCurrentCampagne.query";

import type { Filters } from "./countIntentions.query";
import { countIntentionsQuery } from "./countIntentions.query";

const CAMPAGNE_DEMANDE = "2023";

const countIntentionsFactory =
  (
    deps = {
      countIntentionsQuery,
      getCurrentCampagneQuery,
    }
  ) =>
    async (activeFilters: Filters) => {
      const currentCampagne = await deps.getCurrentCampagneQuery();
      const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee;

      const shouldFetchOnlyIntention = anneeCampagne !== CAMPAGNE_DEMANDE;
      return await deps.countIntentionsQuery({
        campagne:anneeCampagne,
        ...activeFilters,
        shouldFetchOnlyIntention,
      });
    };

export const countIntentionsUsecase = countIntentionsFactory();
