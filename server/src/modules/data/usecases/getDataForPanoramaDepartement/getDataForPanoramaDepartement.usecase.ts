import z from "zod";

import { getStatsSortieQuery } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import {
  getFilters,
  getFormationsDepartement,
  getTopFlopFormationsDepartement,
} from "./dependencies";
import { getDataForPanoramaDepartementSchema } from "./getDataForPanoramaDepartement.schema";

export const getDataForPanoramaDepartementFactory =
  (
    deps = {
      getFormationsDepartement,
      getFilters,
      getTopFlopFormationsDepartement,
      getStatsSortieQuery,
      getPositionQuadrant,
    }
  ) =>
  async (
    activeFilters: z.infer<
      typeof getDataForPanoramaDepartementSchema.querystring
    >
  ) => {
    const [formations, topFlops, filters, statsSortie] = await Promise.all([
      deps.getFormationsDepartement(activeFilters),
      deps.getTopFlopFormationsDepartement(activeFilters),
      deps.getFilters(activeFilters),
      deps.getStatsSortieQuery(activeFilters),
    ]);

    return {
      formations: formations.map((formation) => ({
        ...formation,
        positionQuadrant: deps.getPositionQuadrant(formation, statsSortie),
      })),
      filters,
      topFlops,
    };
  };

export const getDataForPanoramaDepartement =
  getDataForPanoramaDepartementFactory();
