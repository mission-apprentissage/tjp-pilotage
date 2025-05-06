
import type {FiltersSchema} from 'shared/routes/schemas/get.demandes.count.schema';
import type {z} from 'zod';

import type {RequestUser} from '@/modules/core/model/User';
import { getCurrentCampagne } from "@/modules/utils/getCurrentCampagne";

import { countDemandesQuery } from "./countDemandes.query";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
}

const countDemandesFactory =
  (
    deps = {
      countDemandesQuery,
      getCurrentCampagne,
    }
  ) =>
    async (activeFilters: Filters) => {
      const currentCampagne = await deps.getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee;

      return await deps.countDemandesQuery({
        ...activeFilters,
        campagne: anneeCampagne,
      });
    };

export const countDemandesUsecase = countDemandesFactory();
