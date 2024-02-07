import { getStatsSortie } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies } from "./dependencies";

export const getDataForPanoramaRegionFactory =
  (
    deps = {
      getFormationsRegion: dependencies.getFormationsRegion,
      getFilters: dependencies.getFilters,
      getStatsSortie,
      getPositionQuadrant,
    }
  ) =>
  async (activeFilters: {
    codeRegion: string;
    codeNiveauDiplome?: string[];
    libelleFiliere?: string[];
    orderBy?: { column: string; order: "asc" | "desc" };
  }) => {
    const [formations, filters, statsSortie] = await Promise.all([
      deps.getFormationsRegion(activeFilters),
      deps.getFilters(activeFilters),
      deps.getStatsSortie(activeFilters),
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
