import type {FiltersSchema} from 'shared/routes/schemas/get.restitution-intentions.stats.schema';
import type {z} from 'zod';

import type {RequestUser} from '@/modules/core/model/User';
import {getCurrentCampagne} from '@/modules/utils/getCurrentCampagne';

import { getStatsRestitutionIntentionsQuery } from "./getStatsRestitutionIntentions.query";


export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  // campagne est modifié pour qu'il y ait toujours une valeur dans le usecase
  campagne: string;
}

interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}

const getStatsRestitutionIntentionsFactory =
  (
    deps = {
      getStatsRestitutionIntentionsQuery,
      getCurrentCampagne,
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const currentCampagne = await getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee;
      const countRestitutionIntentions = deps.getStatsRestitutionIntentionsQuery({
        ...activeFilters,
        campagne: anneeCampagne,
      });

      return await countRestitutionIntentions;
    };

export const getStatsRestitutionIntentionsUsecase = getStatsRestitutionIntentionsFactory();
