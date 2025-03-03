import type { MILLESIMES_IJ } from "shared";
import type { FiltersSchema } from "shared/routes/schemas/get.corrections.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { getCurrentCampagne } from '@/modules/utils/getCurrentCampagne';

import { getCampagneQuery, getCorrectionsQuery, getFiltersQuery, getStatsCorrectionsQuery } from "./deps";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  millesimeSortie?: (typeof MILLESIMES_IJ)[number];
  campagne: string;
}

export interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}

const getCorrectionsFactory =
  (
    deps = {
      getCorrectionsQuery,
      getStatsCorrectionsQuery,
      getCurrentCampagne,
      getCampagneQuery,
      getFiltersQuery,
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const currentCampagne = await deps.getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee;

      const [stats, corrections, campagne, filters] = await Promise.all([
        deps.getStatsCorrectionsQuery({
          ...activeFilters,
          campagne: anneeCampagne,
        }),
        deps.getCorrectionsQuery({
          ...activeFilters,
          campagne: anneeCampagne,
        }),
        deps.getCampagneQuery({
          ...activeFilters,
          anneeCampagne,
        }),
        deps.getFiltersQuery({
          ...activeFilters,
          campagne: anneeCampagne,
        }),
      ]);

      return {
        ...corrections,
        campagne,
        stats,
        filters,
      };
    };

export const getCorrectionsUsecase = getCorrectionsFactory();
