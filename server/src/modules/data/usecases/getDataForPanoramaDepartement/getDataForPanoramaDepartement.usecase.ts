import type { getDataForPanoramaDepartementSchema } from "shared/routes/schemas/get.panorama.stats.departement.schema";
import type { z } from "zod";

import { getFilters, getFormationsDepartement, getTopFlopFormationsDepartement } from "./dependencies";

export const getDataForPanoramaDepartementFactory =
  (
    deps = {
      getFormationsDepartement,
      getFilters,
      getTopFlopFormationsDepartement,
    }
  ) =>
  async (activeFilters: z.infer<typeof getDataForPanoramaDepartementSchema.querystring>) => {
    const [formations, topFlops, filters] = await Promise.all([
      deps.getFormationsDepartement(activeFilters),
      deps.getTopFlopFormationsDepartement(activeFilters),
      deps.getFilters(activeFilters),
    ]);

    return {
      formations,
      filters,
      topFlops,
    };
  };

export const getDataForPanoramaDepartement = getDataForPanoramaDepartementFactory();
