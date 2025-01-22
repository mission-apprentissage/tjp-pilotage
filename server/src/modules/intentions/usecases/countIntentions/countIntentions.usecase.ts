
import type {FiltersSchema} from 'shared/routes/schemas/get.intentions.count.schema';
import type {z} from 'zod';

import type {RequestUser} from '@/modules/core/model/User';
import { getCurrentCampagne } from "@/modules/utils/getCurrentCampagne";

import { countIntentionsQuery } from "./countIntentions.query";

const CAMPAGNE_DEMANDE = "2023";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  shouldFetchOnlyIntention?: boolean;
}

const countIntentionsFactory =
  (
    deps = {
      countIntentionsQuery,
      getCurrentCampagne,
    }
  ) =>
    async (activeFilters: Filters) => {
      const currentCampagne = await deps.getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters.anneeCampagne ?? currentCampagne.annee;

      const shouldFetchOnlyIntention = anneeCampagne !== CAMPAGNE_DEMANDE;
      return await deps.countIntentionsQuery({
        anneeCampagne,
        ...activeFilters,
        shouldFetchOnlyIntention,
      });
    };

export const countIntentionsUsecase = countIntentionsFactory();
