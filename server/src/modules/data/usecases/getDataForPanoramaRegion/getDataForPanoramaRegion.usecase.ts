import type { getDataForPanoramaRegionSchema } from "shared/routes/schemas/get.panorama.stats.region.schema";
import type { z } from "zod";

import { getFilters, getFormationsRegion, getTauxIJ } from "./dependencies";

export const getDataForPanoramaRegionFactory =
  (
    deps = {
      getFormationsRegion,
      getFilters,
      getTauxIJ,
    }
  ) =>
    async (activeFilters: z.infer<typeof getDataForPanoramaRegionSchema.querystring>) => {
      const [formations, filters, { tauxInsertion, tauxPoursuite }] = await Promise.all([
        deps.getFormationsRegion(activeFilters),
        deps.getFilters(activeFilters),
        deps.getTauxIJ(activeFilters),
      ]);

      return {
        formations: formations.map((formation) => ({
          ...formation,
        })),
        filters,
        tauxInsertion,
        tauxPoursuite,
      };
    };

export const getDataForPanoramaRegion = getDataForPanoramaRegionFactory();
