import type {FiltersSchema} from 'shared/routes/schemas/get.restitution.stats.schema';
import type {z} from 'zod';

import type {RequestUser} from '@/modules/core/model/User';
import {getCurrentCampagne} from '@/modules/utils/getCurrentCampagne';

import { getStatsRestitutionQuery } from "./getStatsRestitution.query";


export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  // campagne est modifié pour qu'il y ait toujours une valeur dans le usecase
  campagne: string;
}

interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}

const getStatsRestitutionFactory =
  (
    deps = {
      getStatsRestitutionQuery,
      getCurrentCampagne,
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const currentCampagne = await getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee;
      const countRestitution = deps.getStatsRestitutionQuery({
        ...activeFilters,
        campagne: anneeCampagne,
      });

      return await countRestitution;
    };

export const getStatsRestitutionUsecase = getStatsRestitutionFactory();
