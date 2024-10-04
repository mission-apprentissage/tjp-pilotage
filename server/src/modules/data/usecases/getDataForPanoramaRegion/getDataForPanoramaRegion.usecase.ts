import { z } from "zod";

import { getStatsSortieQuery } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import {
  getFilters,
  getFormationsRegion,
  getTauxIJ,
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
      getTauxIJ,
    }
  ) =>
  async (
    activeFilters: z.infer<typeof getDataForPanoramaRegionSchema.querystring>
  ) => {
    const [
      formations,
      topFlops,
      filters,
      statsSortie,
      { tauxInsertion, tauxPoursuite },
    ] = await Promise.all([
      deps.getFormationsRegion(activeFilters),
      deps.getTopFlopFormationsRegion(activeFilters),
      deps.getFilters(activeFilters),
      deps.getStatsSortieQuery(activeFilters),
      deps.getTauxIJ(activeFilters),
    ]);

    return {
      formations: formations.map((formation) => ({
        ...formation,
        positionQuadrant: deps.getPositionQuadrant(formation, statsSortie),
      })),
      topFlops,
      filters,
      tauxInsertion,
      tauxPoursuite,
    };
  };

export const getDataForPanoramaRegion = getDataForPanoramaRegionFactory();
