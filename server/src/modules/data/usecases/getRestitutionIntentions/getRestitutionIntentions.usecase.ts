import type { MILLESIMES_IJ } from "shared";
import type { FiltersSchema } from "shared/routes/schemas/get.restitution-intentions.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { getCurrentCampagneQuery } from "@/modules/data/queries/getCurrentCampagne/getCurrentCampagne.query";

import { getDemandes, getFilters, getStats } from "./dependencies";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  millesimeSortie?: (typeof MILLESIMES_IJ)[number];
  campagne: string;
}
export interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}

const getRestitutionIntentionsFactory =
  (
    deps = {
      getDemandes,
      getFilters,
      getStats,
      getCurrentCampagneQuery,
    }
  ) =>
  async (activeFilters: ActiveFilters) => {
    const campagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne = activeFilters?.campagne ?? campagne.annee;
    const [{ count, demandes }, stats, filters] = await Promise.all([
      deps.getDemandes({
        ...activeFilters,
        campagne: anneeCampagne,
      }),
      deps.getStats({
        ...activeFilters,
        campagne: anneeCampagne,
      }),
      deps.getFilters({ ...activeFilters, campagne: anneeCampagne }),
    ]);

    return {
      count,
      filters,
      demandes,
      stats,
      campagne,
    };
  };

export const getRestitutionIntentionsUsecase = getRestitutionIntentionsFactory();
