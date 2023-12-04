import { getStatsSortie } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies } from "./dependencies";

export const getDataForPanoramaDepartementFactory =
  (
    deps = {
      getFormationsDepartement: dependencies.getFormationsDepartement,
      getFilters: dependencies.getFilters,
    }
  ) =>
  async (activeFilters: {
    codeDepartement: string;
    codeNiveauDiplome?: string[];
    filiere?: string[];
    orderBy?: { column: string; order: "asc" | "desc" };
  }) => {
    const [formations, filters, statsSortie] = await Promise.all([
      deps.getFormationsDepartement(activeFilters),
      deps.getFilters(activeFilters),
      getStatsSortie(activeFilters),
    ]);

    return {
      formations: formations.map((formation) => ({
        ...formation,
        positionQuadrant: getPositionQuadrant(formation, statsSortie),
      })),
      filters,
    };
  };

export const getDataForPanoramaDepartement =
  getDataForPanoramaDepartementFactory();
