import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import {getCurrentCampagne} from '@/modules/utils/getCurrentCampagne';

import type { Filters } from "./deps";
import { getCampagne, getFilters, getIntentions } from "./deps";

const CAMPAGNE_DEMANDE = "2023";

const getIntentionsFactory =
  (
    deps = {
      getCampagne,
      getCurrentCampagne,
      getIntentions,
      getFilters,
    }
  ) =>
    async (activeFilters: Filters) => {
      const currentCampagne = await deps.getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee ?? CURRENT_ANNEE_CAMPAGNE;

      const shouldFetchOnlyIntention = anneeCampagne !== CAMPAGNE_DEMANDE;

      const [intentions, campagne, filters] = await Promise.all([
        deps.getIntentions(
          {
            ...activeFilters,
            campagne: anneeCampagne,
          },
          shouldFetchOnlyIntention
        ),
        deps.getCampagne(anneeCampagne),
        deps.getFilters(activeFilters),
      ]);

      return { ...intentions, currentCampagne, campagne, filters };
    };

export const getIntentionsUsecase = getIntentionsFactory();
