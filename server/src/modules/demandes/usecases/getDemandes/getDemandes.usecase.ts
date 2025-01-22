import type { FiltersSchema} from 'shared/routes/schemas/get.demandes.schema';
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";
import type {z} from 'zod';

import type {RequestUser} from '@/modules/core/model/User';
import {getCurrentCampagne} from '@/modules/utils/getCurrentCampagne';

import { getCampagne, getDemandes, getFilters } from "./deps";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
}

const getDemandesFactory =
  (
    deps = {
      getDemandes,
      getCurrentCampagne,
      getCampagne,
      getFilters,
    }
  ) =>
    async (activeFilters: Filters) => {
      const currentCampagne = await deps.getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee ?? CURRENT_ANNEE_CAMPAGNE;

      const [demandes, campagne, filters] = await Promise.all([
        deps.getDemandes({ ...activeFilters, campagne: anneeCampagne }),
        deps.getCampagne(anneeCampagne),
        deps.getFilters(activeFilters),
      ]);

      return { ...demandes, currentCampagne, campagne, filters };
    };

export const getDemandesUsecase = getDemandesFactory();
