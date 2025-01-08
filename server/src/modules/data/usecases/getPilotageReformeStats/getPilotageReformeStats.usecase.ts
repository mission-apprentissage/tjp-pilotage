import type { getPilotageReformeStatsSchema } from "shared/routes/schemas/get.pilotage-reforme.stats.schema";
import type { z } from "zod";

import { getCurrentCampagneQuery } from "@/modules/data/queries/getCurrentCampagne/getCurrentCampagne.query";
import { formatTauxTransformation } from "@/modules/data/utils/formatTauxTransformation";

import { dependencies } from "./dependencies";

export interface Filters extends z.infer<typeof getPilotageReformeStatsSchema.querystring> {
  campagne: string;
}
const getPilotageReformeStatsFactory =
  (
    deps = {
      getCurrentCampagneQuery,
      getStats: dependencies.getStats,
      findFiltersInDb: dependencies.findFiltersInDb,
      getTauxTransformationData: dependencies.getTauxTransformationData,
    },
  ) =>
  async (activeFilters: { codeNiveauDiplome?: string[]; orderBy?: { order: "asc" | "desc"; column: string } }) => {
    const currentCampagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne = currentCampagne.annee;
    const [stats, filters] = await Promise.all([deps.getStats(activeFilters), deps.findFiltersInDb()]);

    const [{ placesTransformees, effectif }] = await deps.getTauxTransformationData({
      ...activeFilters,
      campagne: anneeCampagne,
    });

    const tauxTransformation = formatTauxTransformation(placesTransformees, effectif);

    return {
      ...stats,
      tauxTransformation: tauxTransformation ?? 0,
      filters,
    };
  };

export const getPilotageReformeStats = getPilotageReformeStatsFactory();
