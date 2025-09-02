import type { getDataForPanoramaDepartementSchema } from "shared/routes/schemas/get.panorama.stats.departement.schema";
import type { z } from "zod";

import { getFilters, getFormationsDepartement } from "./dependencies";

export const getDataForPanoramaDepartementFactory =
  (
    deps = {
      getFormationsDepartement,
      getFilters,
    }
  ) =>
    async (activeFilters: z.infer<typeof getDataForPanoramaDepartementSchema.querystring>) => {
      const [formations, filters] = await Promise.all([
        deps.getFormationsDepartement(activeFilters),
        deps.getFilters(activeFilters),
      ]);

      return {
        formations,
        filters,
      };
    };

export const getDataForPanoramaDepartement = getDataForPanoramaDepartementFactory();
