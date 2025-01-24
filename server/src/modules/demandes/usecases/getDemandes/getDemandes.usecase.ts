import type { FiltersSchema} from 'shared/routes/schemas/get.demandes.schema';
import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";
import type {z} from 'zod';

import type {RequestUser} from '@/modules/core/model/User';
import {getCurrentCampagne} from '@/modules/utils/getCurrentCampagne';

import { getDemandes, getFilters } from "./deps";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  campagne: string
}

export interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}

const getDemandesFactory =
  (
    deps = {
      getDemandes,
      getCurrentCampagne,
      getFilters,
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const currentCampagne = await deps.getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee ?? CURRENT_ANNEE_CAMPAGNE;

      const [demandes, filters] = await Promise.all([
        deps.getDemandes({ ...activeFilters, campagne: anneeCampagne }),
        deps.getFilters({... activeFilters, campagne: anneeCampagne}),
      ]);

      return { ...demandes, campagne: currentCampagne, filters };
    };

export const getDemandesUsecase = getDemandesFactory();
