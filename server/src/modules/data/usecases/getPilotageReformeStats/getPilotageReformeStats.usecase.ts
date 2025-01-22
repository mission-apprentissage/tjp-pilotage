import type { FiltersSchema } from "shared/routes/schemas/get.pilotage-reforme.stats.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { formatTauxTransformation } from "@/modules/data/utils/formatTauxTransformation";
import {getCurrentCampagne} from '@/modules/utils/getCurrentCampagne';

import { dependencies } from "./dependencies";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  campagne: string;
}
interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}
const getPilotageReformeStatsFactory =
  (
    deps = {
      getCurrentCampagne,
      getStats: dependencies.getStats,
      findFiltersInDb: dependencies.findFiltersInDb,
      getTauxTransformationData: dependencies.getTauxTransformationData,
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const currentCampagne = await deps.getCurrentCampagne(activeFilters.user);
      const anneeCampagne = currentCampagne.annee;
      const [stats, filters, [{ placesTransformees, effectif }]] = await Promise.all([
        deps.getStats({
          ...activeFilters,
          campagne: anneeCampagne,
        }),
        deps.findFiltersInDb(),
        deps.getTauxTransformationData({
          ...activeFilters,
          campagne: anneeCampagne,
        })
      ]);

      const tauxTransformation = formatTauxTransformation(placesTransformees, effectif);

      return {
        ...stats,
        tauxTransformation: tauxTransformation ?? 0,
        filters,
      };
    };

export const getPilotageReformeStats = getPilotageReformeStatsFactory();
