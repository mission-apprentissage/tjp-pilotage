import type { getDataForPanoramaRegionSchema } from "shared/routes/schemas/get.panorama.stats.region.schema";
import type { z } from "zod";

import { getFilters, getFormationsRegion, getTauxIJ, getTopFlopFormationsRegion } from "./dependencies";

export const getDataForPanoramaRegionFactory =
  (
    deps = {
      getFormationsRegion,
      getFilters,
      getTopFlopFormationsRegion,
      getTauxIJ,
    }
  ) =>
    async (activeFilters: z.infer<typeof getDataForPanoramaRegionSchema.querystring>) => {
      const [formations, topFlops, filters, { tauxInsertion, tauxPoursuite }] = await Promise.all([
        deps.getFormationsRegion(activeFilters),
        deps.getTopFlopFormationsRegion(activeFilters),
        deps.getFilters(activeFilters),
        deps.getTauxIJ(activeFilters),
      ]);

      return {
        formations: formations.map((formation) => ({
          ...formation,
        })),
        topFlops,
        filters,
        tauxInsertion,
        tauxPoursuite,
      };
    };

export const getDataForPanoramaRegion = getDataForPanoramaRegionFactory();
