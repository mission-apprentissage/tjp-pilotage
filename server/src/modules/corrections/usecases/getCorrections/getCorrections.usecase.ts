import type { MILLESIMES_IJ } from "shared";
import type { FiltersSchema } from "shared/routes/schemas/get.corrections.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { getCurrentCampagneQuery } from "@/modules/corrections/queries/getCurrentCampagne/getCurrentCampagne.query";

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
      getCurrentCampagneQuery,
      getCampagneQuery,
      getFiltersQuery,
    },
  ) =>
  async (activeFilters: ActiveFilters) => {
    const campagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne = activeFilters?.campagne ?? campagne.annee;
    const [stats, { count, corrections }, filters] = await Promise.all([
      deps.getStatsCorrectionsQuery({
        ...activeFilters,
        campagne: anneeCampagne,
      }),
      deps.getCorrectionsQuery({
        ...activeFilters,
        campagne: anneeCampagne,
      }),
      deps.getFiltersQuery({
        ...activeFilters,
        campagne: anneeCampagne,
      }),
    ]);

    return {
      corrections,
      count,
      stats,
      filters,
    };
  };

export const getCorrectionsUsecase = getCorrectionsFactory();
