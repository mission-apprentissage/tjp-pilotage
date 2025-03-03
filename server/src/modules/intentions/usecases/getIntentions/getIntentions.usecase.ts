import type { FiltersSchema } from 'shared/routes/schemas/get.intentions.schema';
import type {z} from 'zod';

import type {RequestUser} from '@/modules/core/model/User';
import {getCurrentCampagne} from '@/modules/utils/getCurrentCampagne';

import { getCampagneQuery, getFiltersQuery, getIntentionsQuery } from "./deps";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  campagne: string
}

export interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}
const getIntentionsFactory =
  (
    deps = {
      getCurrentCampagne,
      getCampagneQuery,
      getIntentionsQuery,
      getFiltersQuery,
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const currentCampagne = await deps.getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee;

      const [intentions, campagne, filters] = await Promise.all([
        deps.getIntentionsQuery({ ...activeFilters, campagne: anneeCampagne }),
        deps.getCampagneQuery({ ...activeFilters, anneeCampagne }),
        deps.getFiltersQuery({...activeFilters, campagne: anneeCampagne}),
      ]);

      return { ...intentions, campagne, filters };
    };

export const getIntentionsUsecase = getIntentionsFactory();
