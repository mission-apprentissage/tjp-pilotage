import type { FiltersSchema} from 'shared/routes/schemas/get.demandes.schema';
import type {z} from 'zod';

import type {RequestUser} from '@/modules/core/model/User';
import {getCurrentCampagne} from '@/modules/utils/getCurrentCampagne';

import { getCampagneQuery, getDemandesQuery, getFiltersQuery } from "./deps";

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
      getDemandesQuery,
      getCampagneQuery,
      getCurrentCampagne,
      getFiltersQuery,
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const currentCampagne = await deps.getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee;

      const [demandes, campagne, filters] = await Promise.all([
        deps.getDemandesQuery({ ...activeFilters, campagne: anneeCampagne }),
        deps.getCampagneQuery({ ...activeFilters, anneeCampagne }),
        deps.getFiltersQuery({...activeFilters, campagne: anneeCampagne}),
      ]);

      return { ...demandes, campagne, filters };
    };

export const getDemandesUsecase = getDemandesFactory();
