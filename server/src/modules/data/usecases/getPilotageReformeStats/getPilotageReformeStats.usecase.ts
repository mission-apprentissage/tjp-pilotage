import { formatTauxTransformation } from "@/modules/data/utils/formatTauxTransformation";

import { dependencies } from "./dependencies";

const getPilotageReformeStatsFactory =
  (
    deps = {
      getStats: dependencies.getStats,
      findFiltersInDb: dependencies.findFiltersInDb,
      getTauxTransformationData: dependencies.getTauxTransformationData,
    }
  ) =>
  async (activeFilters: { codeNiveauDiplome?: string[]; orderBy?: { order: "asc" | "desc"; column: string } }) => {
    const [stats, filters] = await Promise.all([deps.getStats(activeFilters), deps.findFiltersInDb()]);

    const [{ transformes, effectif }] = await deps.getTauxTransformationData(activeFilters);

    const tauxTransformation = formatTauxTransformation(transformes, effectif);

    return {
      ...stats,
      tauxTransformation: tauxTransformation ?? 0,
      filters,
    };
  };

export const getPilotageReformeStats = getPilotageReformeStatsFactory();
