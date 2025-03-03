import type { FiltersRegionsSchema } from 'shared/routes/schemas/get.suivi-impact.stats.regions.schema';
import type {z} from 'zod';

import type { RequestUser } from '@/modules/core/model/User';
import { getCurrentCampagne } from '@/modules/utils/getCurrentCampagne';

import * as dependencies from "./deps";


export interface Filters extends z.infer<typeof FiltersRegionsSchema> {
  user: RequestUser;
  rentreesScolaire: Array<string>;
}

interface ActiveFilters extends Omit<Filters, "rentreesScolaire"> {
  rentreesScolaire?: Array<string>;
}

const getSuiviImpactStatsRegionsFactory =
  (
    deps = {
      getStatsRegions: dependencies.getStatsRegions,
      getRentreesScolaire: dependencies.getRentreesScolaire,
      getCurrentCampagne
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const rentreesScolaire = await deps.getRentreesScolaire();
      const statsRegions = await deps.getStatsRegions({ ...activeFilters, rentreesScolaire });

      return {
        statsRegions,
        rentreesScolaire
      };
    };

export const getSuiviImpactStatsRegionsUsecase = getSuiviImpactStatsRegionsFactory();
