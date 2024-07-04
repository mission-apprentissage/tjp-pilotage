import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import {
  Filters,
  getCampagneQuery,
  getIntentionsQuery,
} from "./getIntentions.query";

const CAMPAGNE_DEMANDE = "2023";

const getIntentionsFactory =
  (
    deps = {
      getIntentionsQuery,
      getCurrentCampagneQuery,
      getCampagneQuery,
    }
  ) =>
  async (activeFilters: Filters) => {
    const currentCampagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne =
      activeFilters.campagne ?? currentCampagne.annee ?? CURRENT_ANNEE_CAMPAGNE;

    const shouldFetchOnlyIntention = anneeCampagne !== CAMPAGNE_DEMANDE;

    const [intentions, campagne] = await Promise.all([
      await deps.getIntentionsQuery(
        activeFilters,
        anneeCampagne,
        shouldFetchOnlyIntention
      ),
      await deps.getCampagneQuery(anneeCampagne),
    ]);

    return { ...intentions, currentCampagne, campagne };
  };

export const getIntentionsUsecase = getIntentionsFactory();
