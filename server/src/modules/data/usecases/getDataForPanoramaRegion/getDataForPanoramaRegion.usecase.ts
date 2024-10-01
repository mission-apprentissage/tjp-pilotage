import { z } from "zod";

import { getStatsSortieQuery } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import {
  getFilters,
  getFormationsRegion,
  getTopFlopFormationsRegion,
} from "./dependencies";
import { getDataForPanoramaRegionSchema } from "./getDataForPanoramaRegion.schema";

export const getDataForPanoramaRegionFactory =
  (
    deps = {
      getFormationsRegion,
      getFilters,
      getTopFlopFormationsRegion,
      getStatsSortieQuery,
      getPositionQuadrant,
    }
  ) =>
  async (
    activeFilters: z.infer<typeof getDataForPanoramaRegionSchema.querystring>
  ) => {
    const [formations, topFlops, filters, statsSortie] = await Promise.all([
      deps.getFormationsRegion(activeFilters),
      deps.getTopFlopFormationsRegion(activeFilters),
      deps.getFilters(activeFilters),
      deps.getStatsSortieQuery(activeFilters),
    ]);

    return {
      formations: formations.map((formation) => ({
        ...formation,
        positionQuadrant: deps.getPositionQuadrant(formation, statsSortie),
      })),
      topFlops,
      filters,
    };
  };

export const getDataForPanoramaRegion = getDataForPanoramaRegionFactory();
