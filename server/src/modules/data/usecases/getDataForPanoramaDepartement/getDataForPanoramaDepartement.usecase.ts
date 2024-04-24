import z from "zod";

import { getStatsSortieQuery } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies } from "./dependencies";
import { getDataForPanoramaDepartementSchema } from "./getDataForPanoramaDepartement.schema";

export const getDataForPanoramaDepartementFactory =
  (
    deps = {
      getFormationsDepartement: dependencies.getFormationsDepartement,
      getFilters: dependencies.getFilters,
      getStatsSortieQuery,
      getPositionQuadrant,
    }
  ) =>
  async (
    activeFilters: z.infer<
      typeof getDataForPanoramaDepartementSchema.querystring
    >
  ) => {
    const [formations, filters, statsSortie] = await Promise.all([
      deps.getFormationsDepartement(activeFilters),
      deps.getFilters(activeFilters),
      deps.getStatsSortieQuery(activeFilters),
    ]);

    return {
      formations: formations.map((formation) => ({
        ...formation,
        positionQuadrant: deps.getPositionQuadrant(formation, statsSortie),
      })),
      filters,
    };
  };

export const getDataForPanoramaDepartement =
  getDataForPanoramaDepartementFactory();
