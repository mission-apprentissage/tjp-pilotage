import z from "zod";

import { getStatsSortieParRegionsQuery } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies } from "./dependencies";
import { getDataForPanoramaRegionSchema } from "./getDataForPanoramaRegion.schema";

export const getDataForPanoramaRegionFactory =
  (
    deps = {
      getFormationsRegion: dependencies.getFormationsRegion,
      getFilters: dependencies.getFilters,
      getStatsSortieParRegionsQuery,
      getPositionQuadrant,
    }
  ) =>
  async (
    activeFilters: z.infer<typeof getDataForPanoramaRegionSchema.querystring>
  ) => {
    const [formations, filters, statsSortie] = await Promise.all([
      deps.getFormationsRegion(activeFilters),
      deps.getFilters(activeFilters),
      deps.getStatsSortieParRegionsQuery(activeFilters),
    ]);

    return {
      formations: formations.map((formation) => ({
        ...formation,
        positionQuadrant: deps.getPositionQuadrant(formation, statsSortie),
      })),
      filters,
    };
  };

export const getDataForPanoramaRegion = getDataForPanoramaRegionFactory();
